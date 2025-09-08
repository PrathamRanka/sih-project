# 🌊 AQUANEXUS  
**Presented by Team LimitLess**  

AQUANEXUS is your **one-stop solution to explore and understand microbes**.  
Built for **Internal SIH**, it brings together the power of **Web3, IoT, Machine Learning, AI, and Full-Stack Development**.  

Official Site is live on
# aqua-nexus.vercel.app

---

## ✨ About the Project  
Microbes play a crucial role in ecosystems, human health, and biotechnology.  
AQUANEXUS makes it easier to identify, analyze, and learn about different microbes using modern technologies.  

Our system uses:  
- **IoT devices** for real-time data collection  
- **AI/ML models** for image analysis and classification  
- **Web3** for secure and decentralized data management  
- **Full-stack development** for an interactive user experience  

---

## 🚀 Core Functionalities  
- 🧬 Microbe detection and classification  
- ⚡ Parallel image processing with AI/ML  
- 🔗 Web3-powered secure storage  
- 🌍 IoT integration for data collection  
- 💻 Modern full-stack web app for seamless interaction  

---

## 🛠 Tech Stack  

**Frontend**  
- React + Vite  
- Tailwind CSS  
- Framer Motion  

**Backend**  
- FastAPI (Python)  
- Uvicorn  

**Machine Learning / AI**  
- Gemini API (Google)  
- OpenCV  
- Ultralytics  

**Other Tools**  
- Web3 Integration  
- Docker (optional for deployment)  

---

## 📂 Folder Structure  

```
sih-project/
│
├── client/           # Frontend (React + Vite)
│   ├── public/
│   └── src/
│
├── server/           # Backend (FastAPI)
│   ├── main.py
│   ├── gemini.py
│   ├── requirements.txt
│   ├── best.pt
│   ├── docker/
│   └── .env          # Sample environment variables   
│
├── web3/             # Web3 smart contracts/integration
│
├── vercel.json
├── package.json
└── Readme.md
```

---

## 🛠️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sih-project.git
cd sih-project
```

### 2. Setup Frontend

```bash
cd client
npm install
```

### 3. Setup Backend

```bash
cd ../server
pip install -r requirements.txt
```

---

## ⚙️ Environment Variable Setup


1 Set the following variables in `.env`:

   ```
   # Web3 settings
   WEB3_PROVIDER_URL=your_web3_provider_url

   # Gemini API key
   GEMINI_API_KEY=your_gemini_api_key
   ```

---

## 🚦 Usage Instructions

### 1. Start the Backend Server

```bash
cd server
uvicorn app.main:app --reload
```

### 2. Start the Frontend App

Open a new terminal:

```bash
cd client
npm run dev
```

### 3. Access the App

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🤝 Contribution Guidelines

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Credits

**Team Limitless**  
- Pratham Ranka – Web3 Lead
- Sanchita Jain – Backend Lead  
- Kumar Abhinandan – AI/ML Lead
- Rushil Kapoor – IoT Lead 
- Avneet Kaur Bhatia - Frontend Lead 

_Special thanks to all contributors and the open-source