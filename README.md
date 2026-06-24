# 🎵 Melody Forge AI

Melody Forge AI is a state-of-the-art web application that leverages Deep Learning to train on MIDI files and autonomously compose original music. It features a modern, responsive, and beautiful dashboard interface built with React, paired with a robust Python backend powered by FastAPI and TensorFlow.

![Melody Forge AI Dashboard](screenshot.png)

## ✨ Features

- **MIDI Dataset Upload**: Easily drag and drop your `.mid` or `.midi` files to build a custom training dataset.
- **Real-time Model Training**: Train an LSTM neural network directly through the UI. Monitor training progress, loss metrics, and epochs via live interactive charts.
- **AI Composer**: Generate brand new compositions by adjusting "Creativity (Temperature)" and the number of notes you want to generate.
- **Playback & Export**: Visualize and listen to your newly generated MIDI tracks in the browser, and download them for use in your favorite DAW.
- **Modern Dashboard Design**: A meticulously crafted dark-mode UI with fluid animations, custom theming, and fully responsive layouts.

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite**: Blazing fast modern frontend tooling.
- **Tailwind CSS v4**: Utility-first styling for a perfectly responsive layout.
- **Lucide React**: Beautiful iconography.
- **Recharts**: Dynamic charting for real-time training metrics.
- **Magenta.js / Tone.js**: In-browser audio playback and MIDI handling.

### Backend
- **Python 3.10+**: Core backend logic.
- **FastAPI**: High-performance asynchronous API framework.
- **TensorFlow**: Deep learning framework used for building and training the LSTM music generation model.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (3.10 or higher)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/abakaushik-lgtm/MusicGenerationWithAI.git
cd MusicGenerationWithAI
```

### 2. Backend Setup
Navigate to the `backend` directory, set up a virtual environment, and install dependencies.
```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

Run the FastAPI backend server:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
Open a new terminal window, navigate to the `frontend` directory, install dependencies, and start the development server.
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` in your browser. Upload some MIDI files, click "Start Training", and begin composing!

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
