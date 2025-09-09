# -*- coding: utf-8 -*-
import os
import re
import cv2
import json
import PIL.Image
import requests   # <-- NEW
import google.generativeai as genai
from ultralytics import YOLO
from dotenv import load_dotenv

# ----------------- IPFS Upload Helpers -----------------

def upload_json_to_ipfs(data: dict):
    """Upload JSON metadata to IPFS (Pinata)."""
    jwt = os.getenv("PINATA_JWT")
    if not jwt:
        raise ValueError("PINATA_JWT not found in environment.")
    
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    headers = {"Authorization": f"Bearer {jwt}"}
    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()
    return response.json()

def upload_file_to_ipfs(filepath: str) -> str:
    """Upload a file (image, pdf, etc.) to IPFS (Pinata)."""
    jwt = os.getenv("PINATA_JWT")
    if not jwt:
        raise ValueError("PINATA_JWT not found in environment.")
    
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {"Authorization": f"Bearer {jwt}"}
    with open(filepath, "rb") as f:
        response = requests.post(url, files={"file": (os.path.basename(filepath), f)}, headers=headers)
    response.raise_for_status()
    return response.json()

# ----------------- Helper Functions -----------------

def get_gemini_correction(image_path, yolo_results):
    """
    Asks Gemini to verify YOLO’s detections using an advanced prompt and robust parsing.
    """
    print("-> Initializing Gemini 1.5 Flash for verification.")
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    
    # Use a 'with' statement to ensure the image file is closed automatically.
    with PIL.Image.open(image_path) as img:
        # Create the initial YOLO annotation list from results
        yolo_initial_annotations = []
        class_names = {}
        if yolo_results and yolo_results[0].boxes:
            class_names = yolo_results[0].names
            for box in yolo_results[0].boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
                label = class_names.get(int(box.cls[0].cpu().numpy()), "unknown")
                yolo_initial_annotations.append((x1, y1, x2, y2, label))
        
        print(f"-> Found {len(yolo_initial_annotations)} initial detections from YOLO.")

        yolo_detections_text = [
            f"- Detected '{ann[4]}' at BBox: ({ann[0]}, {ann[1]}, {ann[2]}, {ann[3]})"
            for ann in yolo_initial_annotations
        ]
        yolo_summary = "\n".join(yolo_detections_text) if yolo_detections_text else "No objects were detected by YOLO."

        # --- ADVANCED PROMPT for HIGHER ACCURACY ---
        prompt = f"""
        <role>
        You are a highly precise, automated microbiological analysis system. Your sole purpose is to verify object detections from a machine learning model against a provided image. You must be meticulous and accurate.
        </role>

        <instructions>
        1.  **Analyze the image and the provided YOLO detections.**
        2.  **Think step-by-step.** First, check each YOLO detection for correctness (label and bounding box). Second, scan the entire image for any organisms that YOLO missed.
        3.  **If all YOLO detections are 100% correct and no organisms are missing,** your ONLY response must be the word: `OK`. Do not add any other text.
        4.  **If any detection is incorrect OR if any organism is missing,** you MUST generate a complete and corrected list of ALL organisms in the image. Your response MUST ONLY be a single, valid JSON array of objects. Do not add any introductory text, explanations, or markdown formatting around the JSON.
        </instructions>

        <yolo_detections>
        {yolo_summary}
        </yolo_detections>

        <required_json_format>
        ```json
        [
          {{"box": [x1, y1, x2, y2], "label": "Correct Organism Name"}},
          {{"box": [x1, y1, x2, y2], "label": "Another Correct Organism"}}
        ]
        ```
        </required_json_format>
        """
        
        print("-> Sending request to Gemini with advanced prompt...")
        try:
            response = model.generate_content([prompt, img])
            cleaned_response = response.text.strip()
            print(f"--- GEMINI RAW RESPONSE ---\n{cleaned_response}\n---------------------------")

            # Flexible "OK" check: Look for "OK" instead of an exact match.
            if "OK" in cleaned_response.upper() and len(cleaned_response) < 10:
                print("--- STATUS: Gemini confirmed YOLO detections are OK. ---")
                return "OK", yolo_initial_annotations

            # Robust JSON extraction: Find the start of the list '[' and the end ']'
            json_start = cleaned_response.find('[')
            json_end = cleaned_response.rfind(']')
            
            if json_start != -1 and json_end != -1:
                json_str = cleaned_response[json_start : json_end + 1]
                print(f"--- PARSED JSON FROM GEMINI ---\n{json_str}\n-----------------------------")
                
                corrected_data = json.loads(json_str)
                corrected_annotations = [
                    (item["box"][0], item["box"][1], item["box"][2], item["box"][3], item["label"])
                    for item in corrected_data if "box" in item and "label" in item
                ]
                print(f"--- STATUS: Successfully parsed {len(corrected_annotations)} corrected annotations from Gemini. ---")
                return "CORRECTED", corrected_annotations
            else:
                print("--- WARNING: Gemini did not respond 'OK' and no valid JSON was found. Reverting to original YOLO detections. ---")
                return "OK", yolo_initial_annotations

        except Exception as e:
            # Critical Error Logging: Don't fail silently!
            print(f"!!!!!!!!!! GEMINI CORRECTION FAILED !!!!!!!!!!")
            print(f"Error Type: {type(e).__name__}, Error Details: {e}")
            print(f"Could not process Gemini's response. Reverting to original YOLO detections.")
            if 'response' in locals():
                print(f"Problematic Response Text was: \n{response.text}")
            print(f"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            return "OK", yolo_initial_annotations


def draw_annotations_on_image(image_path, annotations, output_path):
    """Draw bounding boxes + labels + count on the image."""
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Image not found at {image_path}")
    
    print(f"-> Drawing {len(annotations)} final annotations on the image.")
    for x1, y1, x2, y2, class_name in annotations:
        # Draw the bounding box
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        
        # --- Smartly place text label to avoid going off-screen ---
        (text_width, text_height), baseline = cv2.getTextSize(class_name, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
        text_y_pos = y1 - 10 # Default position above the box
        # If the text would go above the top of the image, place it below the box instead
        if text_y_pos < text_height:
             text_y_pos = y1 + text_height + 10
             
        # Add a black background for the text for better readability
        cv2.rectangle(img, (x1, text_y_pos - text_height - baseline), (x1 + text_width, text_y_pos + baseline), (0,0,0), -1)
        cv2.putText(img, class_name, (x1, text_y_pos), cv2.FONT_HERSHEY_SIMPLEX, 
                    0.7, (0, 255, 0), 2, lineType=cv2.LINE_AA)

    # Add count with a black outline for better visibility on any background
    count_text = f"Final Count: {len(annotations)}"
    cv2.putText(img, count_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 3, lineType=cv2.LINE_AA) # Black outline
    cv2.putText(img, count_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, lineType=cv2.LINE_AA) # Green text
    
    cv2.imwrite(output_path, img)
    return output_path


# ----------------- Main Processing Function -----------------

def process_image(image_path, yolo_model, output_folder="outputs"):
    """Process an image through the full YOLO -> Gemini pipeline."""
    
    # --- ADD THIS CONFIGURATION BLOCK ---
    # Ensure the API key is configured for every request.
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("ERROR: GOOGLE_API_KEY not found in environment.")
        raise ValueError("GOOGLE_API_KEY is not set.")
    genai.configure(api_key=api_key)
    # ------------------------------------

    if not os.path.exists(image_path):
        print(f"ERROR: Image file not found at '{image_path}'")
        return None

    print(f"\n===== STARTING PROCESSING FOR: {os.path.basename(image_path)} =====")
    os.makedirs(output_folder, exist_ok=True)

    # 1. Run YOLOv8 for initial object detection
    print(f"--- Step 1: Running YOLOv8 detection ---")
    yolo_results = yolo_model.predict(source=image_path, save=False, conf=0.25, verbose=False)

    # 2. Send YOLO results to Gemini for verification and correction
    print(f"\n--- Step 2: Sending to Gemini for verification ---")
    status, final_annotations = get_gemini_correction(image_path, yolo_results)

    # 3. Draw the final, verified annotations on the image
    print(f"\n--- Step 3: Generating final annotated image ---")
    final_image_path = os.path.join(output_folder, "processed_" + os.path.basename(image_path))
    draw_annotations_on_image(image_path, final_annotations, final_image_path)
    print(f"-> Final annotated image saved to: {final_image_path}")

    # Upload to IPFS
    ipfs_url = upload_file_to_ipfs(final_image_path)   # <--- call helper we wrote earlier
    print(f"-> File uploaded to IPFS: {ipfs_url}")

    # 4. Compile and return the final results
    result = {
        "source_image": image_path,
        "verification_status": status,  # "OK" or "CORRECTED"
        "detected_objects": [ann[4] for ann in final_annotations],
        "final_count": len(final_annotations),
        "annotated_image_path": final_image_path,
        "ipfs_url": ipfs_url  # <--- now included in JSON
    }
    print(f"===== PROCESSING COMPLETE. Status: {status}, Final Count: {result['final_count']} =====")
    # 5. Upload to IPFS
    print("\n--- Step 4: Uploading results to IPFS ---")
    try:
        ipfs_json = upload_json_to_ipfs(result)
        ipfs_image = upload_file_to_ipfs(final_image_path)

        result["ipfs_json_cid"] = ipfs_json.get("IpfsHash")
        result["ipfs_image_cid"] = ipfs_image.get("IpfsHash")

        # Optional: return gateway URLs
        result["ipfs_json_url"] = f"https://gateway.pinata.cloud/ipfs/{result['ipfs_json_cid']}"
        result["ipfs_image_url"] = f"https://gateway.pinata.cloud/ipfs/{result['ipfs_image_cid']}"

        print(f"-> Uploaded JSON CID: {result['ipfs_json_cid']}")
        print(f"-> Uploaded Image CID: {result['ipfs_image_cid']}")
    except Exception as e:
        print(f"⚠️ Failed to upload to IPFS: {e}")

    return result

# ----------------- Example Usage -----------------
if __name__ == '__main__':
    # This block runs when the script is executed directly.
    
    # --- Load YOLOv8 Model ---
    yolo_model_path = "best.pt"
    print(f"-> Loading YOLOv8 model from '{yolo_model_path}'...")
    try:
        yolo = YOLO(yolo_model_path)
        print("-> YOLOv8 model loaded successfully.")
    except Exception as e:
        raise FileNotFoundError(f"🔴 Failed to load YOLO model from '{yolo_model_path}'. Ensure the file exists. Error: {e}")

    # --- Process a single image ---
    image_to_process = 'your_image.jpg' # <--- CHANGE THIS to your image file
    print(f"-> Preparing to process image: '{image_to_process}'")

    if os.path.exists(image_to_process):
        # The process_image function now handles its own API key configuration
        final_result = process_image(image_path=image_to_process, yolo_model=yolo)
        if final_result:
            print("\n--- FINAL RESULT SUMMARY ---")
            print(json.dumps(final_result, indent=2))
            print("--------------------------")
    else:
        print(f"\n--- 🔴 SETUP INSTRUCTION ---")
        print(f"The example image '{image_to_process}' was not found.")
        print("Please update the 'image_to_process' variable in the script to the path of your image file.")
        print("--------------------------")