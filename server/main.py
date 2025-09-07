from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import os
from ultralytics import YOLO
from gemini import process_image


# --- Create the output directory before the app starts ---
os.makedirs("outputs", exist_ok=True)
# --- Load Model Once ---
# The model is loaded into memory when the server starts
try:
    yolo_model = YOLO("best.pt")
    print("✅ YOLO model loaded successfully.")
except Exception as e:
    print(f"🔴 Failed to load YOLO model: {e}")
    yolo_model = None


app = FastAPI()

# --- Serve the 'outputs' directory so images are accessible via URL ---
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# --- Configure CORS to allow communication with your frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. In production, list your frontend's actual domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not yolo_model:
        raise HTTPException(status_code=500, detail="YOLO model is not available.")

    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Pass the pre-loaded model into your function
        result = process_image(
            image_path=temp_path,
            yolo_model=yolo_model, # Pass the loaded model
            output_folder="outputs"
        )

        if not result:
            raise HTTPException(status_code=500, detail="Image processing returned no result.")

        # --------------------- THE FIX IS HERE --------------------- #
        # The backend must return a URL-friendly path.
        # We also create a cleaner JSON response for the frontend.
        
        annotated_path = result.get("annotated_image_path", "")
        
        return {
            "verification_status": result.get("verification_status"),
            "labels": result.get("detected_objects", []),
            "count": result.get("final_count", 0),
            "annotated_image": annotated_path.replace("\\", "/") # Replace backslashes with forward slashes
        }
        # ----------------------------------------------------------- #

    except Exception as e:
        print(f"🔴 An error occurred during prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/")
def read_root():
    return {"message": "Microbe Detection API is running."}