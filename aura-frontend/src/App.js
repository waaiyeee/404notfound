import React, { useState, useEffect } from 'react';
import './App.css'; 
import MatchPage from './dashboard';
// import MatchPage from './MatchPage'; // Assuming you save the new component as MatchPage.js

function App() {
  // --- NEW STATE FOR MATCHING FEATURE ---
  const [view, setView] = useState('chat'); // Switches between 'chat' and 'match'
  const [persona, setPersona] = useState("Analyzing...");
  const [friend, setFriend] = useState(null);

  // --- YOUR EXISTING STATES ---
  const [emotion, setEmotion] = useState("Scanning...");
  const [isDistracted, setIsDistracted] = useState(false);
  const [chat, setChat] = useState([{ sender: 'Aura', text: 'Welcome. I am observing your state to help you better.' }]);
  const [input, setInput] = useState("");
  const [confidence, setConfidence] = useState(65);
  const [matches, setMatches] = useState(0);
  const [anxietyReduction, setAnxietyReduction] = useState(12);

  // --- EMOTION TRACKER (BIO-FEEDBACK) ---
  useEffect(() => {
    if (!emotion) return;
    const updateScore = () => {
      setConfidence(prev => {
        const lowerEmotion = emotion.toLowerCase();
        if (lowerEmotion === 'happy' || lowerEmotion === 'surprise') return Math.min(prev + 5, 100);
        if (['anxious', 'fear', 'sad'].includes(lowerEmotion)) return Math.max(prev - 2, 0);
        return prev;
      });
      setAnxietyReduction(prev => (emotion.toLowerCase() === 'happy' ? prev + 1 : prev));
    };
    updateScore();
  }, [emotion]);

  // --- WEBCAM POLLING ---
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/get_mental_state');
        const data = await res.json();
        setEmotion(data.emotion);
        setIsDistracted(data.distracted);
      } catch (err) { console.error("Backend not running"); }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateSocialStyle = (text) => {
    const words = text.split(/\s+/).length;
    const disclosurePatterns = /\b(i|me|my|feel|think|believe|sense)\b/gi;
    const disclosureCount = (text.match(disclosurePatterns) || []).length;
    const disclosureScore = Math.min((disclosureCount / words) * 20, 10);
    return {
      style: disclosureScore > 5 ? "High-Discloser" : "Direct-Communicator"
    };
  };

  // --- CORE LOGIC: SEND & ANALYZE ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const styleData = calculateSocialStyle(input);
    const userMsg = { sender: 'You', text: input };
    const currentInput = input;
    
    setChat(prev => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          emotion: emotion,
          isDistracted: isDistracted,
          style: styleData.style,
          mode: "Social Sparring"
        }),
      });

      const data = await response.json();

      // 1. Update Metrics
      if (data.confidenceChange !== undefined) {
        setConfidence(prev => Math.min(Math.max(prev + data.confidenceChange, 0), 100));
      }
      
      // 2. Update Personality & Matches
      if (data.personaSummary) setPersona(data.personaSummary);
      if (data.friend) setFriend(data.friend);
      
      if (data.detectedStyle === "High-Discloser") {
        setMatches(prev => prev + 1);
      }

      // 3. Update Chat
      setChat(prev => [...prev, { sender: 'Aura', text: data.response }]);

      // 4. TRIGGER MATCH PAGE: Logic (After 4 messages and decent confidence)
      if (chat.length >= 5 && !isDistracted > 70) {
        setTimeout(() => setView('match'), 2000);
      }

    } catch (err) {
      console.error("AI Error:", err);
    }
  };

  // --- VIEW CONDITIONALS ---
  if (view === 'match') {
    return (
      <MatchPage 
        personaSummary={persona} 
        friendName={friend?.name || "Sarah"} 
        friendTrait={friend?.trait || "Empathetic Peer"} 
        onBack={() => setView('chat')} 
      />
    );
  }

return (
  <div className="app-container">
    {/* STEP 1: If we are in match view, ONLY show the MatchPage. Nothing else. */}
    {view === 'match' ? (
      <MatchPage 
        personaSummary={persona} 
        friendName={friend?.name || "Sarah"} 
        friendTrait={friend?.trait || "Empathetic Peer"} 
        onBack={() => setView('chat')} 
      />
    ) : (
      /* STEP 2: Only show the regular layout if view is NOT 'match' */
      <>
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
          </div>
        </section>

        {/* Sidebar Chat Section (Middle) */}
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

        {/* Dashboard Section (Right) */}
        
      </>
    )}
  </div>
);}

export default App;


