from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
from ultralytics import YOLO
from transformers import pipeline
from PIL import Image

app = Flask(__name__)
CORS(app)

# 1. Load YOLO (Environment/Focus)
yolo_model = YOLO("yolov8n.pt") 

# 2. Load Emotion Model (Mental Health)
# This will download the dima806 model automatically on first run
emotion_classifier = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

current_data = {"emotion": "neutral", "distracted": False}

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success: break

        # --- YOLO: Focus Detection ---
        yolo_results = yolo_model(frame, conf=0.5, verbose=False)
        labels = [yolo_model.names[int(c)] for c in yolo_results[0].boxes.cls]
        current_data["distracted"] = "cell phone" in labels

        # --- Hugging Face: Emotion Detection ---
        # Convert OpenCV BGR frame to PIL RGB for the Transformer model
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(img_rgb)
        
        # Get the top emotion
        emotion_results = emotion_classifier(pil_img)
        if emotion_results:
            current_data["emotion"] = emotion_results[0]['label']

        # --- UI Overlay ---
        annotated_frame = yolo_results[0].plot()
        color = (255, 255, 255) # White
        if current_data["emotion"] in ["sad", "angry", "fear"]: color = (0, 0, 255) # Red for distress
        
        cv2.putText(annotated_frame, f"Emotion: {current_data['emotion']}", (50, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
# Temporary store for active users
active_lobby = [
    {"id": "user_123", "style": "High-Discloser", "score": 8.5},
    {"id": "user_456", "style": "Direct-Communicator", "score": 2.1}
]
import google.generativeai as genai
from flask import request

# 1. Securely set your API key
genai.configure(api_key="your_key")

# Find the exact model name available to YOU
available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
print(f"DEBUG: Your available models are: {available_models}")

# Pick the first one (usually gemini-1.5-flash or gemini-pro)
if available_models:
    model_name = available_models[0] # Use the exact string the API suggests
    model_gemini = genai.GenerativeModel(model_name)
    print(f"SUCCESS: Using model {model_name}")
else:
    print("CRITICAL: No models found for this API key.")
def analyze_communication_style(text):
    words = text.split()
    word_count = len(words)
    
    # Simple NLP rules for "Disclosure"
    personal_pronouns = ['i', 'me', 'my', 'mine', 'feel', 'think', 'believe']
    disclosure_score = sum(1 for word in words if word.lower() in personal_pronouns)
    
    # Categorize the style
    if disclosure_score > 3:
        style = "High-Discloser"  # Open, vulnerable
    elif word_count > 15:
        style = "Detailed-Thinker" # Verbose, analytical
    else:
        style = "Direct" # Brief, concise
        
    return {
        "style": style,
        "word_count": word_count,
        "disclosure_index": disclosure_score
    }

@app.route('/chat', methods=['POST'])
@app.route('/chat', methods=['POST'])
def chat_with_gemini():
    data = request.json
    print("Inbound Data:", data) # Check your terminal for this!
    
    user_text = data.get("message", "")
    user_emotion = data.get("emotion", "neutral").lower() # Ensure lowercase for logic
    
    # 1. Run your custom NLP analysis
    style_data = analyze_communication_style(user_text)
    detected_style = style_data['style']

    # 2. Build the Agentic Prompt
    prompt = f"""
    The user is currently feeling {user_emotion}. 
    Their detected communication style is {detected_style}.
    They said: "{user_text}"
    
    As Aura, their social coach, respond with empathy. 
    If they are sad, be supportive. If they are direct, be concise.
    """

    # 3. Get AI Response
    gemini_response = model_gemini.generate_content(prompt)
    ai_text = gemini_response.text

    # 4. Calculate Dashboard Metrics (Confidence Delta)
    confidence_delta = 0
    if user_emotion == "sad":
        confidence_delta = -5
    elif user_emotion == "happy":
        confidence_delta = 10
    elif user_emotion == "surprise":
        confidence_delta = 5

    # 5. RETURN EVERYTHING to React
    return jsonify({
        "response": ai_text,
        "confidenceChange": confidence_delta,
        "detectedStyle": detected_style,
        "emotionObserved": user_emotion
    })
   

@app.route('/find_match/<current_style_score>')
def find_match(current_style_score):
    score = float(current_style_score)
    # Match the user with the person closest to their disclosure score
    best_match = min(active_lobby, key=lambda x: abs(x['score'] - score))
    
    return jsonify({
        "match_found": True,
        "peer_id": best_match['id'],
        "reason": f"Both of you are {best_match['style']}s"
    })
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_mental_state')
def get_mental_state():
    return jsonify(current_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)