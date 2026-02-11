from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
from ultralytics import YOLO
from transformers import pipeline
from PIL import Image
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# 1. Load CV Models
yolo_model = YOLO("yolov8n.pt") 
emotion_classifier = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

# 2. Configure Gemini
genai.configure(api_key="myapikey")
model_gemini = genai.GenerativeModel('gemini-1.5-flash') # Simplified selection

current_data = {"emotion": "neutral", "distracted": False}

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success: break

        yolo_results = yolo_model(frame, conf=0.5, verbose=False)
        labels = [yolo_model.names[int(c)] for c in yolo_results[0].boxes.cls]
        current_data["distracted"] = "cell phone" in labels

        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(img_rgb)
        emotion_results = emotion_classifier(pil_img)
        if emotion_results:
            current_data["emotion"] = emotion_results[0]['label']

        annotated_frame = yolo_results[0].plot()
        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

def analyze_communication_style(text):
    words = text.split()
    word_count = len(words)
    personal_pronouns = ['i', 'me', 'my', 'mine', 'feel', 'think', 'believe']
    disclosure_score = sum(1 for word in words if word.lower() in personal_pronouns)
    
    if disclosure_score > 3:
        style = "High-Discloser"
    elif word_count > 15:
        style = "Detailed-Thinker"
    else:
        style = "Direct"
        
    return {"style": style, "word_count": word_count}

@app.route('/chat', methods=['POST'])
def chat_with_gemini():
    try:
        data = request.json
        user_text = data.get("message", "")
        user_emotion = data.get("emotion", "neutral")
        is_distracted = data.get("isDistracted", False)
        
        # Logic for personality tracking
        style_info = analyze_communication_style(user_text) 
        current_style = style_info['style']
        word_count = style_info['word_count']

        # Determine if we should offer a match
        if word_count > 5 and not is_distracted:
            prompt = f"""
            The user is focused. As Aura, tell them you found a match sharing their {current_style} style. 
            Ask: "I've found a match for you. Would you like to meet them or keep practicing?"
            """
        else:
            prompt = f"Acknowledge user is {user_emotion}. As Aura, ask one social personality question."

        response = model_gemini.generate_content(prompt)
        
        friends = {
            "High-Discloser": {"name": "Sarah", "trait": "Empathetic Listener"},
            "Direct": {"name": "Marcus", "trait": "Action-Oriented Peer"},
            "Detailed-Thinker": {"name": "Elena", "trait": "Strategic Brainstormer"}
        }
        
        summaries = {
            "High-Discloser": "Vulnerable & Empathetic",
            "Detailed-Thinker": "Analytical & Observant",
            "Direct": "Action-Oriented & Concise"
        }

        return jsonify({
            "response": response.text,
            "personaSummary": summaries.get(current_style, "Exploring..."),
            "confidenceChange": 10 if not is_distracted else -5,
            "friend": friends.get(current_style, {"name": "Alex", "trait": "Explorer"}),
            "detectedStyle": current_style
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_mental_state')
def get_mental_state():
    return jsonify(current_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)