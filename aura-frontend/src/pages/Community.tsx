import { useNavigate } from 'react-router-dom';
import AppFrame from '../layouts/AppFrame';
import TopNav from '../components/TopNav';
import GlassCard from '../components/ui/GlassCard';

export default function Community() {
  const navigate = useNavigate();

  const allMatches = [
    {
      id: 1,
      name: 'Alex M.',
      compatibility: 92,
      verbosity: 'MED',
      disclosure: 'D1',
      interests: ['anime', 'games'],
      reason: 'Similar disclosure + verbosity',
      bio: 'Enjoys deep conversations about anime and gaming. Looking for someone to practice social skills with.'
    },
    {
      id: 2,
      name: 'Jordan L.',
      compatibility: 87,
      verbosity: 'HIGH',
      disclosure: 'D2',
      interests: ['music', 'art'],
      reason: 'Complementary communication style',
      bio: 'Artist who loves sharing thoughts on music and creative processes. Open to meaningful conversations.'
    },
    {
      id: 3,
      name: 'Sam K.',
      compatibility: 85,
      verbosity: 'LOW',
      disclosure: 'D0',
      interests: ['sports', 'fitness'],
      reason: 'Matches your communication pace',
      bio: 'Fitness enthusiast looking for workout buddies and casual chats about staying healthy.'
    },
    {
      id: 4,
      name: 'Taylor R.',
      compatibility: 83,
      verbosity: 'MED',
      disclosure: 'D1',
      interests: ['games', 'anime'],
      reason: 'Shared interests + similar style',
      bio: 'Gamer and anime fan who enjoys analyzing storylines and character development.'
    },
  ];

  return (
    <AppFrame>
      <TopNav />
      
      <div className="community-container">
        <div className="community-header">
          <h1 className="community-title">Your Matched Community</h1>
          <p className="community-subtitle">
            Based on your communication style and interests, here are peers who might resonate with you.
            These matches are calculated using verbosity, disclosure depth, and shared interests.
          </p>
        </div>
        
        <div className="matches-grid">
          {allMatches.map((match) => (
            <GlassCard key={match.id} className="match-card">
              <div className="match-header">
                <div>
                  <h3 className="match-name">{match.name}</h3>
                  <p className="match-reason">{match.reason}</p>
                </div>
                <span className="compatibility-badge">{match.compatibility}%</span>
              </div>
              
              <p className="match-bio">{match.bio}</p>
              
              <div className="match-details">
                <div className="detail-row">
                  <span className="detail-label">Verbosity:</span>
                  <span className="detail-value">{match.verbosity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Disclosure:</span>
                  <span className="detail-value">{match.disclosure}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Interests:</span>
                  <span className="detail-value">{match.interests.join(', ')}</span>
                </div>
              </div>
              
              <button 
                className="btn-connect"
                onClick={() => alert(`Connecting you with ${match.name}... Feature coming soon!`)}
              >
                Connect with {match.name}
              </button>
            </GlassCard>
          ))}
        </div>
        
        <div className="back-section">
          <button className="btn-back" onClick={() => navigate('/modes')}>
            ← Back to Practice Modes
          </button>
        </div>
      </div>
      
      <style>{`
        .community-container {
          padding: 60px 48px 80px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .community-header {
          text-align: center;
          margin-bottom: 56px;
        }
        
        .community-title {
          font-size: 42px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        
        .community-subtitle {
          font-size: 16px;
          color: #5a6b7d;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto;
        }
        
        .matches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .match-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
        }
        
        .match-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .match-name {
          font-size: 22px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 6px;
        }
        
        .match-reason {
          font-size: 13px;
          color: #5a6b7d;
          margin: 0;
        }
        
        .compatibility-badge {
          background: rgba(100, 120, 200, 0.15);
          color: #4a5568;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 16px;
          font-weight: 700;
        }
        
        .match-bio {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .match-details {
          background: rgba(240, 245, 250, 0.5);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .detail-label {
          font-size: 13px;
          color: #5a6b7d;
          font-weight: 500;
        }
        
        .detail-value {
          font-size: 13px;
          color: #2d3748;
          font-weight: 600;
        }
        
        .btn-connect {
          width: 100%;
          padding: 14px 28px;
          background: rgba(100, 120, 200, 0.85);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(100, 120, 200, 0.2);
        }
        
        .btn-connect:hover {
          background: rgba(90, 110, 190, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(100, 120, 200, 0.3);
        }
        
        .back-section {
          text-align: center;
          padding-top: 32px;
          border-top: 1px solid rgba(200, 200, 220, 0.3);
        }
        
        .btn-back {
          padding: 12px 24px;
          background: transparent;
          color: #5a6b7d;
          border: none;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s ease;
          text-decoration: underline;
        }
        
        .btn-back:hover {
          color: #2d3748;
        }
        
        @media (max-width: 768px) {
          .community-container {
            padding: 40px 24px 60px;
          }
          
          .community-title {
            font-size: 32px;
          }
          
          .matches-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppFrame>
  );
}
