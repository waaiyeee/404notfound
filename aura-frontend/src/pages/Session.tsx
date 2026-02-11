import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppFrame from '../layouts/AppFrame';
import TopNav from '../components/TopNav';
import GlassCard from '../components/ui/GlassCard';

interface Message {
  sender: 'user' | 'aura';
  text: string;
  time: string;
}

interface PersonaData {
  style: string;
  summary: string;
  friend: {
    name: string;
    trait: string;
  };
}

const MODE_PROMPTS: Record<string, string> = {
  interview: "Hi, I'm Aura. Let's practice for your interview. Tell me about yourself and what role you're preparing for.",
  difficult: "Hi, I'm Aura. This is a safe space to practice difficult conversations. What challenging topic would you like to work through?",
  smalltalk: "Hi, I'm Aura. Let's practice casual conversation. What's been on your mind lately?",
  default: "Hi, I'm Aura. This is your safe space to practice. Tell me, how are you feeling today?"
};

export default function Session() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const practiceMode = searchParams.get('mode') || 'default';
  
  // Camera and emotion state
  const [cameraOn, setCameraOn] = useState(true);
  const [emotion, setEmotion] = useState<string>('neutral');
  const [isDistracted, setIsDistracted] = useState(false);
  
  // Chat state
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'aura',
      text: MODE_PROMPTS[practiceMode] || MODE_PROMPTS.default,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
  ]);
  
  // Persona tracking
  const [messageCount, setMessageCount] = useState(0);
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [showMatchOffer, setShowMatchOffer] = useState(false);

  // Poll for emotion and distraction from backend
  useEffect(() => {
    if (!cameraOn) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/get_mental_state');
        const data = await res.json();
        setEmotion(data.emotion || 'neutral');
        setIsDistracted(data.distracted || false);
      } catch (err) {
        console.error("Failed to get mental state:", err);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cameraOn]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg: Message = {
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setMessageCount(prev => prev + 1);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          emotion: emotion,
          isDistracted: isDistracted,
          messageCount: messageCount + 1,
          practiceMode: practiceMode // Send practice mode to backend
        }),
      });

      const data = await response.json();
      
      // Add Aura's response
      const auraMsg: Message = {
        sender: 'aura',
        text: data.response,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, auraMsg]);
      
      // Store persona data
      if (data.personaSummary && data.friend) {
        setPersonaData({
          style: data.detectedStyle || 'Direct',
          summary: data.personaSummary,
          friend: data.friend
        });
      }
      
      // Check if we should show match offer (after 5+ messages and focused)
      if ((messageCount + 1) >= 5 && !isDistracted && data.friend) {
        setShowMatchOffer(true);
      }
      
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        sender: 'aura',
        text: "I'm having trouble connecting right now. Let's try again.",
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleGoToMatch = () => {
    if (personaData) {
      navigate('/match', { state: personaData });
    }
  };

  // Get mode-specific title
  const getTitle = () => {
    const titles: Record<string, string> = {
      interview: 'Mock Interview Practice',
      difficult: 'Difficult Conversation Practice',
      smalltalk: 'Small Talk Practice',
      default: 'Aura Wellness Chat'
    };
    return titles[practiceMode] || titles.default;
  };

  const getSubtitle = () => {
    const subtitles: Record<string, string> = {
      interview: 'Practice your interview skills in a safe, judgment-free environment.',
      difficult: 'Navigate challenging conversations with support.',
      smalltalk: 'Build confidence with casual conversation.',
      default: 'Share how you\'re feeling. Aura is here to listen and understand.'
    };
    return subtitles[practiceMode] || subtitles.default;
  };

  return (
    <AppFrame>
      <TopNav />
      
      <div className="session-container">
        {/* Left side - Video Feed */}
        <div className="session-left">
          <GlassCard className="video-panel">
            <div className="emotion-pill">
              Current Emotion: {emotion.toUpperCase()}
            </div>
            
            <div className="video-preview" style={{ 
              border: isDistracted ? '4px solid #ff9f43' : '1px solid rgba(162, 155, 254, 0.3)' 
            }}>
              {cameraOn ? (
                <img 
                  src="/video_feed" 
                  alt="Camera Feed"
                  className="camera-feed"
                />
              ) : (
                <div className="camera-off-state">
                  <p className="camera-off-text">
                    Camera is off. Turn it on below for live vibe checks.
                  </p>
                </div>
              )}
            </div>
            
            <div className="toggle-row">
              <span className="toggle-label-small">Camera Vibe Checks</span>
              <button 
                className={`toggle-btn ${cameraOn ? 'active' : ''}`}
                onClick={() => setCameraOn(!cameraOn)}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>
            
            {cameraOn && (
              <div className="vibe-info">
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value">
                    {isDistracted ? '⚠️ Distracted (phone detected)' : '✓ Focused'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Messages:</span>
                  <span className="info-value">{messageCount} / 5</span>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
        
        {/* Right side - Chat */}
        <div className="session-right">
          <GlassCard className="chat-panel">
            <div className="chat-header">
              <h3 className="chat-title">{getTitle()}</h3>
              <p className="chat-subtitle">
                {getSubtitle()}
              </p>
            </div>
            
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                  <span className="message-time">{msg.time}</span>
                </div>
              ))}
              
              {showMatchOffer && (
                <div className="match-offer">
                  <div className="match-offer-content">
                    <span className="match-icon">✨</span>
                    <p className="match-text">
                      I've analyzed your communication style and found a potential friend match. 
                      Would you like to see who I found?
                    </p>
                    <button className="btn-view-match" onClick={handleGoToMatch}>
                      View My Match
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="chat-input-section">
              <input
                type="text"
                className="chat-input"
                placeholder="How do you feel?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              
              <button className="btn-send" onClick={handleSend}>
                Send to Aura
              </button>
              
              <div className="session-actions">
                <button className="btn-action" onClick={() => navigate('/summary')}>
                  End Session
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      <style>{`
        .session-container {
          display: grid;
          grid-template-columns: 1fr 500px;
          gap: 28px;
          padding: 32px 48px;
          min-height: calc(100vh - 120px);
        }
        
        .session-left {
          display: flex;
        }
        
        .video-panel {
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .emotion-pill {
          position: absolute;
          top: 24px;
          left: 24px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(200, 210, 230, 0.4);
          border-radius: 20px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #4a5568;
          letter-spacing: 0.02em;
          z-index: 10;
        }
        
        .video-preview {
          flex: 1;
          background: linear-gradient(135deg, rgba(200, 210, 240, 0.2), rgba(220, 200, 240, 0.2));
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          min-height: 400px;
          overflow: hidden;
          transition: border 0.3s ease;
        }
        
        .camera-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
        }
        
        .camera-off-state {
          padding: 40px;
          text-align: center;
        }
        
        .camera-off-text {
          color: #5a6b7d;
          font-size: 15px;
          line-height: 1.6;
        }
        
        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-top: 1px solid rgba(200, 200, 220, 0.3);
          margin-bottom: 16px;
        }
        
        .toggle-label-small {
          font-size: 15px;
          font-weight: 500;
          color: #2d3748;
        }
        
        .toggle-btn {
          position: relative;
          width: 48px;
          height: 26px;
          background: rgba(200, 200, 220, 0.4);
          border: none;
          border-radius: 13px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .toggle-btn.active {
          background: rgba(100, 120, 200, 0.7);
        }
        
        .toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .toggle-btn.active .toggle-slider {
          transform: translateX(22px);
        }
        
        .vibe-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: rgba(240, 245, 250, 0.5);
          border-radius: 10px;
        }
        
        .info-label {
          font-size: 13px;
          color: #5a6b7d;
          font-weight: 500;
        }
        
        .info-value {
          font-size: 14px;
          color: #2d3748;
          font-weight: 600;
        }
        
        .session-right {
          display: flex;
        }
        
        .chat-panel {
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        
        .chat-header {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(200, 200, 220, 0.3);
        }
        
        .chat-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 6px;
        }
        
        .chat-subtitle {
          font-size: 13px;
          color: #5a6b7d;
          margin: 0;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        
        .message {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .message.user {
          align-items: flex-end;
        }
        
        .message.aura {
          align-items: flex-start;
        }
        
        .message-bubble {
          background: rgba(255, 255, 255, 0.85);
          padding: 12px 16px;
          border-radius: 14px;
          max-width: 85%;
          font-size: 14px;
          color: #2d3748;
          line-height: 1.5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .message.user .message-bubble {
          background: rgba(100, 120, 200, 0.15);
        }
        
        .message-time {
          font-size: 11px;
          color: #a0aec0;
          padding: 0 6px;
        }
        
        .match-offer {
          background: linear-gradient(135deg, rgba(100, 120, 200, 0.15), rgba(120, 100, 200, 0.15));
          border: 2px solid rgba(100, 120, 200, 0.3);
          border-radius: 16px;
          padding: 20px;
          margin-top: 10px;
        }
        
        .match-offer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-align: center;
        }
        
        .match-icon {
          font-size: 32px;
        }
        
        .match-text {
          font-size: 14px;
          color: #2d3748;
          line-height: 1.5;
          margin: 0;
        }
        
        .btn-view-match {
          padding: 12px 28px;
          background: rgba(100, 120, 200, 0.9);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(100, 120, 200, 0.25);
        }
        
        .btn-view-match:hover {
          background: rgba(90, 110, 190, 1);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(100, 120, 200, 0.35);
        }
        
        .chat-input-section {
          border-top: 1px solid rgba(200, 200, 220, 0.3);
          padding-top: 16px;
        }
        
        .chat-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid rgba(200, 200, 220, 0.4);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          color: #2d3748;
          outline: none;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        
        .chat-input:focus {
          border-color: rgba(100, 120, 200, 0.5);
          background: rgba(255, 255, 255, 0.85);
        }
        
        .btn-send {
          width: 100%;
          padding: 14px;
          background: rgba(100, 120, 200, 0.85);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(100, 120, 200, 0.2);
          margin-bottom: 12px;
        }
        
        .btn-send:hover {
          background: rgba(90, 110, 190, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(100, 120, 200, 0.3);
        }
        
        .session-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn-action {
          flex: 1;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(200, 200, 220, 0.4);
          border-radius: 8px;
          font-size: 13px;
          color: #5a6b7d;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-action:hover {
          background: rgba(255, 255, 255, 0.9);
        }
        
        @media (max-width: 1024px) {
          .session-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </AppFrame>
  );
}
