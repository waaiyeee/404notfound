import { useLocation, useNavigate } from 'react-router-dom';
import AppFrame from '../layouts/AppFrame';
import TopNav from '../components/TopNav';
import GlassCard from '../components/ui/GlassCard';

interface PersonaData {
  style: string;
  summary: string;
  friend: {
    name: string;
    trait: string;
  };
}

export default function Match() {
  const location = useLocation();
  const navigate = useNavigate();
  const personaData = location.state as PersonaData | null;
  
  // Fallback data if navigated directly
  const summary = personaData?.summary || "Exploring...";
  const friendName = personaData?.friend?.name || "Alex";
  const friendTrait = personaData?.friend?.trait || "Empathetic Peer";

  const handleConnect = () => {
    alert(`Connecting you with ${friendName}... This feature is coming soon!`);
  };

  return (
    <AppFrame>
      <TopNav />
      
      <div className="match-container">
        <GlassCard className="match-card">
          <div className="match-icon-wrapper">
            <span className="match-icon">✨</span>
          </div>
          
          <h1 className="match-title">Aura's Analysis Complete</h1>
          
          <p className="match-description">
            After conversing with you, Aura has realized that you are someone who is{' '}
            <span className="persona-highlight">{summary}</span>.
          </p>

          <div className="friend-card">
            <p className="friend-label">We found a connection</p>
            <h2 className="friend-name">{friendName}</h2>
            <p className="friend-trait">
              is also a <span className="trait-highlight">{friendTrait}</span>
            </p>
            <p className="friend-message">
              "They are comfortable and excited to speak with you!"
            </p>
          </div>

          <button className="btn-connect" onClick={handleConnect}>
            Say Hello to {friendName}
          </button>
          
          <button className="btn-back" onClick={() => navigate('/session')}>
            Keep Practicing with Aura
          </button>
        </GlassCard>
      </div>
      
      <style>{`
        .match-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 120px);
          padding: 60px 48px;
        }
        
        .match-card {
          max-width: 500px;
          width: 100%;
          padding: 48px 40px;
          text-align: center;
        }
        
        .match-icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(100, 120, 200, 0.12);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px;
        }
        
        .match-icon {
          font-size: 42px;
        }
        
        .match-title {
          font-size: 28px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }
        
        .match-description {
          font-size: 16px;
          color: #5a6b7d;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        
        .persona-highlight {
          font-weight: 600;
          color: rgba(100, 120, 200, 1);
        }
        
        .friend-card {
          background: rgba(100, 120, 200, 0.08);
          border: 1px solid rgba(100, 120, 200, 0.2);
          border-radius: 20px;
          padding: 32px 28px;
          margin-bottom: 32px;
        }
        
        .friend-label {
          font-size: 11px;
          color: rgba(100, 120, 200, 0.7);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        
        .friend-name {
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        
        .friend-trait {
          font-size: 14px;
          color: #5a6b7d;
          margin-bottom: 20px;
        }
        
        .trait-highlight {
          font-weight: 600;
          color: #2d3748;
        }
        
        .friend-message {
          font-size: 14px;
          color: #4a5568;
          font-style: italic;
          line-height: 1.5;
          margin: 0;
        }
        
        .btn-connect {
          width: 100%;
          padding: 16px 32px;
          background: rgba(100, 120, 200, 0.9);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 18px rgba(100, 120, 200, 0.25);
          margin-bottom: 16px;
        }
        
        .btn-connect:hover {
          background: rgba(90, 110, 190, 1);
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(100, 120, 200, 0.35);
        }
        
        .btn-back {
          width: 100%;
          padding: 12px 24px;
          background: transparent;
          color: #5a6b7d;
          border: none;
          font-size: 14px;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .btn-back:hover {
          color: #2d3748;
        }
        
        @media (max-width: 768px) {
          .match-container {
            padding: 40px 24px;
          }
          
          .match-card {
            padding: 36px 28px;
          }
          
          .match-title {
            font-size: 24px;
          }
          
          .friend-card {
            padding: 28px 24px;
          }
        }
      `}</style>
    </AppFrame>
  );
}
