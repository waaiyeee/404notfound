import React, { useState, useEffect } from 'react';

function App() {
  const [emotion, setEmotion] = useState("Scanning...");
  const [isDistracted, setIsDistracted] = useState(false);
  const [chat, setChat] = useState([{ sender: 'Aura', text: 'Welcome. I am observing your state to help you better.' }]);
  const [input, setInput] = useState("");

  // Periodically fetch the Mental State from Python
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
    }, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    const userMsg = { sender: 'You', text: input };
    setChat([...chat, userMsg]);
    
    // Logic: Send input + emotion context to your Gemini function
    // Example: getGeminiResponse(input, emotion, isDistracted)
    
    setInput("");
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0c29', color: 'white' }}>
      {/* Video Feed Section */}
      <div style={{ flex: 2, padding: '20px' }}>
        <div style={{ position: 'relative' }}>
          <img 
            src="http://localhost:5000/video_feed" 
            style={{ width: '100%', borderRadius: '20px', border: isDistracted ? '5px solid orange' : '2px solid #a29bfe' }} 
            alt="AI Feed"
          />
          <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.6)', padding: '10px', borderRadius: '10px' }}>
            Current Emotion: <strong>{emotion.toUpperCase()}</strong>
          </div>
        </div>
      </div>

      {/* Sidebar Chat Section */}
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', display: 'flex', flex_direction: 'column' }}>
        <h3>Aura Wellness Chat</h3>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chat.map((msg, i) => (
            <p key={i}><strong>{msg.sender}:</strong> {msg.text}</p>
          ))}
        </div>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="How do you feel?" 
          style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
        />
        <button onClick={handleSend} style={{ marginTop: '10px', padding: '10px', background: '#a29bfe', border: 'none', borderRadius: '5px' }}>
          Speak to Aura
        </button>
      </div>
    </div>
  );
}

export default App;