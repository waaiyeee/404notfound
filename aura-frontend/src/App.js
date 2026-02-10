import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure your CSS is in this file
import ImpactDashboard from './dashboard';

function App() {
  const [emotion, setEmotion] = useState("Scanning...");
  const [isDistracted, setIsDistracted] = useState(false);
  const [chat, setChat] = useState([{ sender: 'Aura', text: 'Welcome. I am observing your state to help you better.' }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [confidence, setConfidence] = useState(65); // Default start
  const [matches, setMatches] = useState(0);
  const [anxietyReduction, setAnxietyReduction] = useState(12);

  // 2. Add logic to update these (e.g., inside handleSend)
  useEffect(() => {
  // We only want to change the score if we have a valid emotion
  if (!emotion) return;

  const updateScore = () => {
    setConfidence(prev => {
      if (emotion === 'Happy' || emotion === 'Surprise') {
        // Boost confidence for positive/engaged emotions
        return Math.min(prev + 5, 100); 
      } else if (emotion === 'Anxious' || emotion === 'Fear' || emotion === 'Sad') {
        // Slightly drop confidence, but don't let it go below 0
        return Math.max(prev - 2, 0);
      }
      return prev; // No change for Neutral
    });

    setAnxietyReduction(prev => {
      // If the user was anxious but is now happy, increase the "Reduction" stat
      if (emotion === 'Happy') return prev + 1;
      return prev;
    });
  };

  updateScore();
}, [emotion]); // This runs EVERY time the 'emotion' state changes

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/get_mental_state');
        const data = await res.json();
        setEmotion(data.emotion);
        setIsDistracted(data.distracted);
      } catch (err) {
        console.error("Backend not running");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const calculateSocialStyle = (text) => {
  const words = text.split(/\s+/).length;
  // Patterns for personal disclosure (I, me, my, feel, think)
  const disclosurePatterns = /\b(i|me|my|feel|think|believe|sense)\b/gi;
  const disclosureCount = (text.match(disclosurePatterns) || []).length;
  
  // Disclosure Score (0 to 10)
  const disclosureScore = Math.min((disclosureCount / words) * 20, 10);
  
  return {
    wordCount: words,
    disclosureScore: disclosureScore.toFixed(1),
    style: disclosureScore > 5 ? "High-Discloser" : "Direct-Communicator"
  };
};
 const handleSend = async () => {
  if (!input.trim()) return;

  // 1. Prepare User Message & Style Analysis
  const styleData = calculateSocialStyle(input);
  const userMsg = { sender: 'You', text: input };
  const currentInput = input; 
  
  // Update UI immediately
  setChat(prev => [...prev, userMsg]);
  setInput("");

  try {
    // 2. Send data to Python
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: currentInput,
        emotion: emotion, // From your webcam state
        isDistracted: isDistracted,
        style: styleData.style,
        mode: "Social Sparring (Interview Prep)"
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    // 3. WAIT for the data to arrive
    const data = await response.json();
    console.log("Data from Python:", data);

    // 4. NOW update the Dashboard (Using the data we just got)
    if (data.confidenceChange !== undefined) {
      setConfidence(prev => Math.min(Math.max(prev + data.confidenceChange, 0), 100));
    }

    if (data.detectedStyle === "High-Discloser") {
      setMatches(prev => prev + 1);
    }

    // 5. Update Chat with Gemini's response
    const auraResponse = { 
      sender: 'Aura', 
      text: data.response 
    };
    setChat(prev => [...prev, auraResponse]);

  } catch (err) {
    console.error("AI Error:", err);
    setChat(prev => [...prev, { 
      sender: 'Aura', 
      text: "I'm having trouble connecting. Is the Python server running?" 
    }]);
  }
};

  return (
    <div className="app-container">
      {/* Video Feed Section */}
      <section className="video-section">
        <div className="video-wrapper">
          <img 
            src="http://localhost:5000/video_feed" 
            style={{ border: isDistracted ? '4px solid #ff9f43' : '1px solid rgba(162, 155, 254, 0.3)' }} 
            alt="AI Feed"
          />
          <div className="emotion-badge">
            Current Emotion: <strong>{emotion.toUpperCase()}</strong>
          </div>
          {isDistracted && <div className="distraction-alert">Focus Detected: Low</div>}
        </div>
      </section>

      {/* Sidebar Chat Section */}
      <aside className="sidebar">
        <h3>Aura Wellness Chat</h3>
        <div className="chat-window">
          {chat.map((msg, i) => (
            <div key={i} className={`message ${msg.sender.toLowerCase()}`}>
              <small>{msg.sender}</small>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        
        <div className="input-area">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="How do you feel?" 
          />
          <button onClick={handleSend}>Speak to Aura</button>
        </div>
      </aside>
    <div className="sidebar">
        <ImpactDashboard 
          confidence={confidence} 
          matches={matches} 
          anxiety={anxietyReduction} 
        />
        
        {/* Button to simulate a match for the demo */}
        <button 
          onClick={() => setMatches(m => m + 1)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg"
        >
          Simulate Peer Match
        </button>
      </div>
    </div>
  );
  
}


export default App;
