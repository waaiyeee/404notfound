# Aura - AI-Powered Social Confidence Coach


## 🌟 Overview

Aura addresses the root causes of social isolation—anxiety and communication friction—by creating a data-driven feedback loop. Using real-time computer vision and agentic AI, Aura provides a **"Safe Sandbox"** for users to build social muscle memory before connecting them with peer communities matched by their linguistic style.

Instead of just "connecting people," Aura addresses the anxiety that makes connection feel impossible. We target the physiological and psychological barriers to social engagement.

## 🎯 Core Features

### 1. **Biometric Vision Engine**
Real-time facial emotion analysis using Transformer models (dima806) and eye-tracking with object detection.
- **Measurable Impact**: Provides objective data on stress and engagement levels that users can track over time
- Detects emotional states: happy, sad, angry, surprised, neutral, fearful, disgusted
- Monitors distractions through object detection (phone usage, eye contact)

### 2. **Agentic AI Social Coach**
Gemini-powered "Voice" that adapts its personality based on the user's live emotional state.
- **Innovative Approach**: Moves beyond "standard chatbots" to an agentic system that "sees" and "feels" for the user
- Provides real-time emotional support and guidance
- Adjusts conversation style based on detected stress levels
- Offers breathing exercises and calming techniques during high-stress moments

### 3. **The Safe Sandbox**
A low-stakes environment for practicing interviews and confrontations with real-time "vibe checks."
- **Psychological Design**: Fosters "Psychological Safety" and "Trust" by allowing failure without social consequences
- Practice scenarios: job interviews, difficult conversations, casual social interactions
- Real-time feedback on body language and emotional regulation
- Confidence scoring that tracks improvement over time

### 4. **Style-Match Algorithm**
NLP analysis of user disclosure levels and verbosity to pair compatible communicators.
- **Community Building**: Addresses "Community Fragmentation" by ensuring high-quality, low-friction peer connections
- Analyzes communication patterns across multiple dimensions
- Matches users based on linguistic compatibility
- Considers timezone, shared interests, and communication preferences

## 📊 Measurable Social Impact

Aura doesn't rely on "feelings"—it relies on data. Our Impact Dashboard tracks:

- **Regulation Score**: Reduction in peak anxiety (biometric spikes) during social sparring
- **Engagement Score**: Increase in eye contact and verbal participation
- **Social Readiness**: A quantifiable metric that graduates users from AI practice to human interaction

Once a user's Confidence Score hits 80% and their Style Profile is mapped, Aura unlocks the **'Peer Match'** feature. We use technology to build the bridge, but the goal is always meaningful human connection.

## 🛠️ Technical Architecture

### Tech Stack

**Frontend:**
- React 19.2.0 with TypeScript
- Vite for build tooling
- React Router for navigation
- Modern CSS for styling

**Backend:**
- Python 3.x with Flask
- Flask-CORS for cross-origin requests
- Computer Vision: OpenCV + YOLOv8 (Ultralytics)
- Emotion Recognition: Hugging Face Transformers (dima806/facial_emotions_image_detection)
- AI Engine: Google Gemini 2.5 Flash

**NLP & Matching:**
- Custom NLP pipeline for style analysis
- Disclosure tier detection
- Verbosity scoring
- Vector-based user matching algorithm

### System Architecture

```
┌─────────────────┐
│   React Frontend │
│   (Vite + TS)   │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
┌────────▼────────┐
│  Flask Backend  │
│  - API Routes   │
│  - Video Stream │
└────────┬────────┘
         │
    ┌────┴────┬─────────┬──────────┐
    │         │         │          │
┌───▼───┐ ┌──▼──┐ ┌────▼─────┐ ┌──▼───┐
│ YOLO  │ │ Dima│ │  Gemini  │ │  NLP │
│ Model │ │ 806 │ │  AI API  │ │Engine│
└───────┘ └─────┘ └──────────┘ └──────┘
```

### Scalability
The modular design allows for new "Social Scenarios" to be added instantly. The low-latency Flask backend is built to handle multiple concurrent users, making it a viable tool for university campuses or workplace wellness programs.

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Webcam** (for biometric analysis)
- **Google Gemini API Key**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 404notfound
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install flask flask-cors opencv-python ultralytics transformers pillow google-generativeai torch
   ```

4. **Configure Gemini API**
   - Obtain an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update `app.py` with your API key:
     ```python
     genai.configure(api_key="YOUR_API_KEY_HERE")
     ```

5. **Download YOLOv8 model**
   - The `yolov8n.pt` file should already be in the root directory
   - If missing, it will be automatically downloaded on first run

6. **Run the Flask server**
   ```bash
   python app.py
   ```
   The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd aura-frontend
   ```

2. **Install Node dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

4. **Build for production**
   ```bash
   npm run build
   ```

### Environment Configuration

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
FLASK_ENV=development
FLASK_PORT=5000
FRONTEND_URL=http://localhost:5173
```

## 📖 Usage Guide

### Getting Started

1. **Launch both servers** (backend and frontend)
2. **Allow webcam access** when prompted by your browser
3. **Complete your profile** with interests and communication preferences
4. **Start your first practice session** in the Safe Sandbox

### Practice Scenarios

**Mock Interview:**
- Choose industry and role
- Receive AI-generated interview questions
- Get real-time feedback on confidence and body language
- Review your performance metrics after completion

**Difficult Conversation:**
- Select scenario type (conflict resolution, boundary setting, etc.)
- Practice with an adaptive AI partner
- Receive coaching on emotional regulation
- Build confidence through repeated exposure

**Casual Chat:**
- Low-pressure conversation practice
- Focus on maintaining eye contact and engagement
- Track improvements in social comfort

### Understanding Your Metrics

**Confidence Score (0-100%):**
- Combines emotional stability, engagement, and verbal participation
- Updates in real-time during practice sessions
- Unlocks peer matching at 80%

**Regulation Score:**
- Measures reduction in anxiety spikes
- Tracks your ability to self-regulate during stressful moments
- Shows progress over multiple sessions

**Engagement Score:**
- Eye contact duration and consistency
- Verbal participation and response quality
- Body language indicators

## 🔒 Privacy & Ethics

### Privacy-First Design
- **All biometric analysis happens locally** on your device
- Only text metadata is sent to the cloud for AI processing
- No video or images are stored or transmitted
- User data is never sold or used as a product

### Accessibility
By providing a non-judgmental AI partner 24/7, we support marginalized individuals who may feel blocked by traditional social groups or the cost of professional coaching.

### Ethical Considerations
- Transparent about AI limitations
- Encourages graduation to real human connection
- Does not replace professional mental health support
- Provides crisis resources when needed

