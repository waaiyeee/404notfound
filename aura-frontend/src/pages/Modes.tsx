import { useNavigate, useSearchParams } from 'react-router-dom';
import AppFrame from '../layouts/AppFrame';
import TopNav from '../components/TopNav';
import GlassCard from '../components/ui/GlassCard';

export default function Modes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  const scenarios = [
    {
      id: 'interview',
      title: 'Mock interview',
      description: 'Practice introducing yourself and answering questions in a professional setting.',
      difficulty: 'Medium intensity',
      skills: ['Introduce yourself clearly', 'Answer questions confidently', 'Manage interview stress']
    },
    {
      id: 'difficult',
      title: 'Difficult conversation',
      description: 'Navigate challenging topics like apologies, boundaries, and conflict resolution.',
      difficulty: 'Higher intensity',
      skills: ['Apologize authentically', 'Set boundaries kindly', 'Stay grounded under pressure']
    },
    {
      id: 'smalltalk',
      title: 'Small talk practice',
      description: 'Build comfort with casual conversation and keep dialogue flowing naturally.',
      difficulty: 'Gentle start',
      skills: ['Keep conversation flowing', 'Ask open-ended questions', 'Find common ground']
    }
  ];

  const communityPeers = [
    {
      id: 1,
      name: 'Alex M.',
      compatibility: 92,
      reason: 'Similar disclosure + verbosity'
    },
    {
      id: 2,
      name: 'Jordan L.',
      compatibility: 87,
      reason: 'Complementary communication style'
    }
  ];

  return (
    <AppFrame>
      <TopNav />
      
      <div className="modes-container">
        <div className="modes-header">
          <h1 className="modes-title">Choose your Safe Sandbox</h1>
          <p className="modes-subtitle">
            Practice real conversations in a judgment-free space. Aura adapts to your emotional state.
          </p>
        </div>
        
        <div className="scenarios-grid">
          {scenarios.map((scenario) => (
            <GlassCard key={scenario.id} className="scenario-card">
              <div className="scenario-header">
                <h2 className="scenario-title">{scenario.title}</h2>
                <span className="difficulty-tag">{scenario.difficulty}</span>
              </div>
              
              <p className="scenario-description">{scenario.description}</p>
              
              <div className="skills-section">
                <span className="skills-label">Skills you'll practice:</span>
                <div className="skills-chips">
                  {scenario.skills.map((skill, idx) => (
                    <span key={idx} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>
              
              <button 
                className="btn-start-scenario"
                onClick={() => navigate(`/session?mode=${scenario.id}`)}
              >
                Start practice
              </button>
            </GlassCard>
          ))}
        </div>
        
        <div className="community-section">
          <div className="community-header">
            <h2 className="community-title">Your matched community</h2>
            <p className="community-subtitle">
              Based on your communication style, we found peers who might resonate with you.
            </p>
          </div>
          
          <div className="community-grid">
            {communityPeers.map((peer) => (
              <GlassCard key={peer.id} className="peer-card-small">
                <div className="peer-header-compact">
                  <div>
                    <h4 className="peer-name-small">{peer.name}</h4>
                    <p className="peer-reason">{peer.reason}</p>
                  </div>
                  <span className="compatibility-small">{peer.compatibility}%</span>
                </div>
                <button 
                  className="btn-view-profile"
                  onClick={() => navigate('/community')}
                >
                  View full matches
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .modes-container {
          padding: 60px 48px 80px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .modes-header {
          text-align: center;
          margin-bottom: 56px;
        }
        
        .modes-title {
          font-size: 42px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        
        .modes-subtitle {
          font-size: 17px;
          color: #5a6b7d;
          font-weight: 400;
          line-height: 1.5;
        }
        
        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 28px;
          margin-bottom: 80px;
        }
        
        .scenario-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          min-height: 420px;
        }
        
        .scenario-header {
          margin-bottom: 16px;
        }
        
        .scenario-title {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        
        .difficulty-tag {
          display: inline-block;
          background: rgba(200, 210, 230, 0.4);
          color: #5a6b7d;
          padding: 6px 16px;
          border-radius: 18px;
          font-size: 13px;
          font-weight: 500;
        }
        
        .scenario-description {
          font-size: 15px;
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        
        .skills-section {
          flex: 1;
          margin-bottom: 28px;
        }
        
        .skills-label {
          display: block;
          font-size: 13px;
          color: #5a6b7d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 14px;
        }
        
        .skills-chips {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .skill-chip {
          background: rgba(240, 245, 250, 0.6);
          color: #4a5568;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.4;
          border: 1px solid rgba(200, 210, 230, 0.3);
        }
        
        .btn-start-scenario {
          width: 100%;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          background: rgba(100, 120, 200, 0.85);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(100, 120, 200, 0.2);
        }
        
        .btn-start-scenario:hover {
          background: rgba(90, 110, 190, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(100, 120, 200, 0.3);
        }
        
        .community-section {
          padding-top: 60px;
          border-top: 1px solid rgba(200, 200, 220, 0.3);
        }
        
        .community-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .community-title {
          font-size: 32px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        
        .community-subtitle {
          font-size: 15px;
          color: #5a6b7d;
          line-height: 1.5;
        }
        
        .community-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .peer-card-small {
          padding: 24px;
        }
        
        .peer-header-compact {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .peer-name-small {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 6px;
        }
        
        .peer-reason {
          font-size: 13px;
          color: #5a6b7d;
          margin: 0;
        }
        
        .compatibility-small {
          background: rgba(100, 120, 200, 0.15);
          color: #4a5568;
          padding: 6px 14px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 700;
        }
        
        .btn-view-profile {
          width: 100%;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(200, 200, 220, 0.4);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #5a6b7d;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-view-profile:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .modes-container {
            padding: 40px 24px 60px;
          }
          
          .modes-title {
            font-size: 32px;
          }
          
          .scenarios-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .community-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppFrame>
  );
}
