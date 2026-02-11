import { useNavigate } from 'react-router-dom';
import AppFrame from '../layouts/AppFrame';
import TopNav from '../components/TopNav';
import GlassCard from '../components/ui/GlassCard';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <AppFrame>
      <TopNav />
      
      <div className="landing-container">
        <div className="hero-content">
          <div className="pill-label">
            Biometric vision is optional (OFF by default)
          </div>
          
          <h1 className="hero-title">
            Combat social isolation.<br />Build real connection.
          </h1>
          
          <p className="hero-subtitle">
            Aura creates a safe sandbox for practicing conversations with live emotional feedback,<br />
            then connects you to peers who share your communication style.
          </p>
          
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/session')}>
              Start practicing
            </button>
            <button className="btn-secondary" onClick={() => navigate('/modes')}>
              See your matches
            </button>
          </div>
        </div>
        
        <div className="floating-cards">
          <GlassCard className="card-left">
            <h3 className="card-title-small">Safe Sandbox</h3>
            <p className="card-text-small">
              Practice in a judgment-free space.<br />
              Real-time vibe checks (emotion, stress, engagement).<br />
              Aura adapts to your emotional state.
            </p>
          </GlassCard>
          
          <GlassCard className="card-right">
            <h3 className="card-title-small">Data-Driven Matching</h3>
            <p className="card-text-small">
              Track your progress over time.<br />
              Discover peers matched by linguistic style.<br />
              Join communities built on compatibility.
            </p>
          </GlassCard>
        </div>
        
        <div className="trust-section">
          <GlassCard className="trust-card">
            <div className="trust-content">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <div className="trust-info">
                  <h4 className="trust-heading">Your data stays private</h4>
                  <p className="trust-text">Camera and biometrics are optional. We never share identifiable data without consent.</p>
                </div>
              </div>
              
              <div className="trust-item">
                <span className="trust-icon">💙</span>
                <div className="trust-info">
                  <h4 className="trust-heading">Psychological safety first</h4>
                  <p className="trust-text">Aura uses supportive language and gives you full control over intensity and pacing.</p>
                </div>
              </div>
              
              <div className="trust-item">
                <span className="trust-icon">📊</span>
                <div className="trust-info">
                  <h4 className="trust-heading">Measurable impact</h4>
                  <p className="trust-text">See your stress decrease and engagement grow across sessions—real progress, tracked gently.</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      <style>{`
        .landing-container {
          position: relative;
          min-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 80px 48px 120px;
        }
        
        .hero-content {
          text-align: center;
          max-width: 820px;
          margin-bottom: 120px;
        }
        
        .pill-label {
          display: inline-block;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(200, 200, 220, 0.35);
          border-radius: 24px;
          padding: 9px 22px;
          font-size: 13px;
          color: #5a6b7d;
          margin-bottom: 32px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        
        .hero-title {
          font-size: 58px;
          font-weight: 600;
          color: #2d3748;
          line-height: 1.15;
          margin-bottom: 24px;
          letter-spacing: -0.025em;
        }
        
        .hero-subtitle {
          font-size: 18px;
          color: #1a202c;
          line-height: 1.65;
          margin-bottom: 48px;
          font-weight: 500;
        }
        
        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        
        .btn-primary, .btn-secondary {
          padding: 16px 36px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: rgba(100, 120, 200, 0.85);
          color: white;
          box-shadow: 0 4px 18px rgba(100, 120, 200, 0.25);
        }
        
        .btn-primary:hover {
          background: rgba(90, 110, 190, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 6px 26px rgba(100, 120, 200, 0.35);
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.75);
          color: #4a5568;
          border: 1px solid rgba(200, 200, 220, 0.45);
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.92);
          transform: translateY(-2px);
        }
        
        .floating-cards {
          display: flex;
          gap: 32px;
          width: 100%;
          max-width: 900px;
          margin-bottom: 80px;
        }
        
        .card-left, .card-right {
          flex: 1;
          padding: 28px;
        }
        
        .card-title-small {
          font-size: 18px;
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        
        .card-text-small {
          font-size: 14px;
          color: #5a6b7d;
          line-height: 1.7;
        }
        
        .trust-section {
          width: 100%;
          max-width: 900px;
        }
        
        .trust-card {
          padding: 40px;
        }
        
        .trust-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        
        .trust-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        
        .trust-icon {
          font-size: 28px;
          flex-shrink: 0;
          line-height: 1;
        }
        
        .trust-info {
          flex: 1;
        }
        
        .trust-heading {
          font-size: 17px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        
        .trust-text {
          font-size: 15px;
          color: #5a6b7d;
          line-height: 1.6;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .landing-container {
            padding: 60px 24px 80px;
          }
          
          .hero-content {
            margin-bottom: 60px;
          }
          
          .hero-title {
            font-size: 38px;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .cta-buttons {
            flex-direction: column;
            width: 100%;
          }
          
          .btn-primary, .btn-secondary {
            width: 100%;
          }
          
          .floating-cards {
            flex-direction: column;
            gap: 20px;
          }
          
          .trust-card {
            padding: 28px;
          }
        }
      `}</style>
    </AppFrame>
  );
}
