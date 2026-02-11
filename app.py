from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
from ultralytics import YOLO
from transformers import pipeline
from PIL import Image
import google.generativeai as genai
from nlpforpairs import (
    tokenize, disclosure_tier, verbosity_bucket, 
    tier_to_num, build_style_vectors, match_pairs
)
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# 1. Load CV Models
yolo_model = YOLO("yolov8n.pt") 
emotion_classifier = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

# 2. Configure Gemini
genai.configure(api_key="YOUR_API_KEY_HERE")
model = genai.GenerativeModel('gemini-2.5-flash')

# 3. User data storage (in production, use a database)
user_messages = defaultdict(list)
user_profiles = {}
current_data = {"emotion": "neutral", "distracted": False}

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success: 
            break

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


def analyze_communication_style_advanced(messages_list):
    """
    Use NLP matching algorithm to analyze communication style
    Returns: style category, verbosity level, disclosure depth
    """
    if not messages_list:
        return {
            "style": "Direct",
            "verbosity": "LOW",
            "disclosure": "D0",
            "word_count": 0
        }
    
    # Calculate average word count
    word_counts = [len(tokenize(msg["text"])) for msg in messages_list]
    mean_words = sum(word_counts) / len(word_counts) if word_counts else 0
    
    # Get disclosure tiers
    tiers = [disclosure_tier(msg["text"]) for msg in messages_list]
    
    # Get representative disclosure (80th percentile)
    nums = sorted(tier_to_num(t) for t in tiers)
    if nums:
        p80_idx = int(0.8 * (len(nums) - 1))
        rep_disclosure_num = nums[p80_idx]
        rep_disclosure = {0: "D0", 1: "D1", 2: "D2"}.get(rep_disclosure_num, "D0")
    else:
        rep_disclosure = "D0"
    
    # Get verbosity bucket
    verb_bucket = verbosity_bucket(mean_words)
    
    # Map to legacy style names for frontend compatibility
    if verb_bucket == "LOW" and rep_disclosure == "D0":
        style = "Direct"
    elif verb_bucket == "MED" and rep_disclosure == "D1":
        style = "High-Discloser"
    elif verb_bucket == "HIGH" or rep_disclosure == "D2":
        style = "Detailed-Thinker"
    else:
        style = "Direct"  # Default
    
    return {
        "style": style,
        "verbosity": verb_bucket,
        "disclosure": rep_disclosure,
        "word_count": int(mean_words)
    }


@app.route('/api/chat', methods=['POST'])
def chat_with_gemini():
    try:
        print("=== Chat Request Received ===")
        data = request.json
        
        user_text = data.get("message", "")
        user_emotion = data.get("emotion", "neutral")
        is_distracted = data.get("isDistracted", False)
        message_count = data.get("messageCount", 0)
        user_id = data.get("userId", "default_user")
        practice_mode = data.get("practiceMode", "default")
        
        print(f"User: {user_id}, Message: {user_text}")
        print(f"Emotion (camera): {user_emotion}, Distracted: {is_distracted}, Count: {message_count}")
        
        # Store message for analysis
        timestamp = len(user_messages[user_id]) + 1
        user_messages[user_id].append({
            "user_id": user_id,
            "timestamp": timestamp,
            "text": user_text
        })
        
        # Analyze communication style using advanced NLP
        style_info = analyze_communication_style_advanced(user_messages[user_id])
        current_style = style_info['style']
        
        print(f"Style: {current_style}, Verbosity: {style_info['verbosity']}, Disclosure: {style_info['disclosure']}")

        # Determine if we should offer a match (after 5+ messages and focused)
        if message_count >= 5 and not is_distracted:
            prompt = f"""
            The user has been chatting with you for {message_count} messages. 
            They communicate in a {current_style} style with {style_info['verbosity']} verbosity
            and {style_info['disclosure']} disclosure depth.
            As Aura, warmly tell them you've found a potential friend match based on their communication style.
            Ask if they'd like to meet them or continue practicing.
            Be warm, encouraging, and supportive.
            Keep your response to 2-3 sentences.
            """
        else:
            # Build context-aware prompt based on practice mode and user's actual message
            if practice_mode == "interview":
                prompt = f"""
                The user is practicing for an interview. They just said: "{user_text}"
                As Aura, respond warmly and ask a relevant follow-up interview question or provide supportive feedback.
                Be encouraging and professional.
                Keep your response to 1-2 sentences.
                """
            elif practice_mode == "difficult":
                prompt = f"""
                The user is practicing difficult conversations. They just said: "{user_text}"
                As Aura, respond with empathy and help them navigate this challenging topic.
                Be supportive and constructive.
                Keep your response to 1-2 sentences.
                """
            elif practice_mode == "smalltalk":
                prompt = f"""
                The user is practicing small talk. They just said: "{user_text}"
                As Aura, continue the casual conversation naturally and ask an engaging follow-up question.
                Be friendly and conversational.
                Keep your response to 1-2 sentences.
                """
            else:
                # Default mode - respond to the user's actual message
                prompt = f"""
                The user just said: "{user_text}"
                As Aura, respond naturally to what they actually said.
                Be warm, empathetic, and supportive.
                Ask a thoughtful follow-up question to help them practice social skills.
                Keep your response to 1-2 sentences.
                """

        print(f"Sending prompt to Gemini...")
        response = model.generate_content(prompt)
        print(f"✅ Response received: {response.text[:100]}...")
        
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

        result = {
            "response": response.text,
            "personaSummary": summaries.get(current_style, "Exploring..."),
            "confidenceChange": 10 if not is_distracted else -5,
            "friend": friends.get(current_style, {"name": "Alex", "trait": "Explorer"}),
            "detectedStyle": current_style,
            "styleDetails": {
                "verbosity": style_info['verbosity'],
                "disclosure": style_info['disclosure'],
                "wordCount": style_info['word_count']
            }
        }
        
        print(f"✅ Sending response back to frontend")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ ERROR in chat_with_gemini: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e), "response": "I'm having trouble connecting right now. Let's try again."}), 500


@app.route('/api/match_users', methods=['POST'])
def match_users():
    """
    New endpoint to match multiple users using the NLP algorithm
    Expects: list of user IDs
    Returns: matched pairs with scores
    """
    try:
        data = request.json
        user_ids = data.get("userIds", [])
        
        if len(user_ids) < 2:
            return jsonify({"error": "Need at least 2 users to match"}), 400
        
        # Build user profiles
        users = []
        for uid in user_ids:
            if uid in user_messages and user_messages[uid]:
                users.append({
                    "user_id": uid,
                    "timezone": "Asia/Singapore",
                    "languages": ["en"],
                    "interests": ["general"],  # Could be expanded with user preferences
                    "opts": {"stretch_mode": False}
                })
        
        # Get all messages
        all_messages = []
        for uid in user_ids:
            all_messages.extend(user_messages.get(uid, []))
        
        # Build style vectors and match
        style = build_style_vectors(all_messages, users)
        pairs, unmatched = match_pairs(style, top_k=3)
        
        return jsonify({
            "pairs": [{"user1": a, "user2": b, "score": s} for a, b, s in pairs],
            "unmatched": unmatched,
            "styles": {uid: sv for uid, sv in style.items() if sv.get("eligible")}
        })
        
    except Exception as e:
        print(f"❌ ERROR in match_users: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/get_mental_state')
def get_mental_state():
    return jsonify(current_data)


if __name__ == "__main__":
    print("🚀 Starting Aura Backend on port 5001...")
    print("📹 Camera will be initialized when /video_feed is accessed")
    print("🤖 Gemini AI configured with gemini-2.5-flash model")
    print("🧠 NLP-based user matching system enabled")
    print("")
    app.run(host='0.0.0.0', port=5001, debug=True)
