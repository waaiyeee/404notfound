import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppFrame from '../layouts/AppFrame';
import TopNav from '../components/TopNav';
import GlassCard from '../components/ui/GlassCard';

export default function Session() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'smalltalk';
  
  const [message, setMessage] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const [coachMode, setCoachMode] = useState<'gentle' | 'direct' | 'encouraging'>('gentle');
  const [messages, setMessages] = useState([
    {
      sender: 'aura',
      text: "Hi, I'm Aura. This is your safe space to practice. If you want, we can start with a simple greeting—no pressure.",
      time: '2:34 PM'
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, {
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }]);
    setMessage('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: "aura",
        text: "That's a good start. You seem calm right now—would you like to go deeper, or keep it light?",
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }]);
    }, 1200);
  };

  return (
    <AppFrame>
      <TopNav />
      
      <div className="session-container">
        <div className="session-left">
          <GlassCard className="video-panel">
            <div className="emotion-pill">Current Emotion: NEUTRAL</div>
            
            <div className="video-preview">
              {cameraOn ? (
                <div className="camera-active">
                  <div className="camera-placeholder">Live Camera Feed</div>
                </div>
              ) : (
                <div className="camera-off-state">
                  <p className="camera-off-text">Camera is off. If you want live vibe checks, turn it on below.</p>
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
              <div className="vibe-metrics">
                <div className="metric-compact">
                  <span className="metric-label-small">Stress level</span>
                  <span className="metric-value-small">Low (23%)</span>
                </div>
                <div className="metric-compact">
                  <span className="metric-label-small">Engagement</span>
                  <span className="metric-value-small">Moderate (64%)</span>
                </div>
                <div className="metric-compact">
                  <span className="metric-label-small">Eye attention</span>
                  <span className="metric-value-small">Stable</span>
                </div>
                <div className="metric-compact">
                  <span className="metric-label-small">Gaze stability</span>
                  <span className="metric-value-small">87%</span>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
        
        <div className="session-right">
          <GlassCard className="chat-panel">
            <div className="chat-header">
              <h3 className="chat-title">Aura Wellness Chat</h3>
              <div className="coach-mode-selector">
                <span className="mode-label">Aura's mode:</span>
                <select 
                  className="mode-select"
                  value={coachMode}
                  onChange={(e) => setCoachMode(e.target.value as any)}
                >
                  <option value="gentle">Gentle</option>
                  <option value="direct">Direct</option>
                  <option value="encouraging">Encouraging</option>
                </select>
              </div>
            </div>
            
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  <div className="message-bubble-new">
                    {msg.text}
                  </div>
                  <span className="message-time-new">{msg.time}</span>
                </div>
              ))}
            </div>
            
            <div className="chat-input-section">
              <input
                type="text"
                className="chat-input-new"
                placeholder="Type to Aura..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              
              <button className="btn-speak" onClick={handleSend}>
                Speak to Aura
              </button>
              
              <div className="session-actions">
                <button className="btn-action">💡 Hint</button>
                <button className="btn-action">↻ Try again</button>
                <button className="btn-action" onClick={() => navigate('/summary')}>
                  End session
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      <style>{`
        .session-container {
          display: grid;
          grid-template-columns: 1fr 420px;
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
          background: rgba(255, 255, 255, 0.85);
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
        }
        
        .camera-active {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .camera-placeholder {
          color: #5a6b7d;
          font-size: 16px;
          font-weight: 500;
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
        
        .vibe-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .metric-compact {
          background: rgba(240, 245, 250, 0.5);
          padding: 12px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .metric-label-small {
          font-size: 12px;
          color: #5a6b7d;
          font-weight: 500;
        }
        
        .metric-value-small {
          font-size: 15px;
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
          margin-bottom: 12px;
        }
        
        .coach-mode-selector {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .mode-label {
          font-size: 13px;
          color: #5a6b7d;
        }
        
        .mode-select {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(200, 200, 220, 0.4);
          border-radius: 8px;
          font-size: 13px;
          color: #2d3748;
          cursor: pointer;
          outline: none;
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
        
        .message-bubble-new {
          background: rgba(255, 255, 255, 0.85);
          padding: 12px 16px;
          border-radius: 14px;
          max-width: 85%;
          font-size: 14px;
          color: #2d3748;
          line-height: 1.5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .message.user .message-bubble-new {
          background: rgba(100, 120, 200, 0.15);
        }
        
        .message-time-new {
          font-size: 11px;
          color: #a0aec0;
          padding: 0 6px;
        }
        
        .chat-input-section {
          border-top: 1px solid rgba(200, 200, 220, 0.3);
          padding-top: 16px;
        }
        
        .chat-input-new {
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
        
        .chat-input-new:focus {
          border-color: rgba(100, 120, 200, 0.5);
          background: rgba(255, 255, 255, 0.85);
        }
        
        .btn-speak {
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
        
        .btn-speak:hover {
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
          padding: 8px 12px;
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