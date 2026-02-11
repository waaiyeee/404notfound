import { useNavigate } from 'react-router-dom';
import AppFrame from '../layouts/AppFrame';
import TopNav from '../components/TopNav';
import GlassCard from '../components/ui/GlassCard';

export default function Summary() {
  const navigate = useNavigate();

  return (
    <AppFrame>
      <TopNav />
      
      <div className="summary-container">
        <GlassCard className="summary-card">
          <h1 className="summary-title">Your Session Insights</h1>
          <p className="summary-subtitle">
            You practiced for 12 minutes. Here's what we observed—gently, with care.
          </p>
          
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Average stress</span>
              <span className="metric-value">24% (Low)</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Engagement</span>
              <span className="metric-value">68% (Good)</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Eye attention</span>
              <span className="metric-value">Stable</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Emotional range</span>
              <span className="metric-value">Neutral → Calm</span>
            </div>
          </div>
          
          <div className="progress-section">
            <h3 className="section-label">Progress over time</h3>
            <div className="trend-placeholder">
              <div className="trend-bar" style={{ width: '45%', background: 'rgba(100, 120, 200, 0.3)' }}></div>
              <div className="trend-bar" style={{ width: '62%', background: 'rgba(100, 120, 200, 0.5)' }}></div>
              <div className="trend-bar" style={{ width: '68%', background: 'rgba(100, 120, 200, 0.7)' }}></div>
            </div>
            <p className="trend-note">Your engagement has improved across 3 sessions.</p>
          </div>
          
          <div className="tips-section">
            <h3 className="section-label">Gentle observations</h3>
            
            <div className="tip-card">
              <span className="tip-icon">✨</span>
              <div className="tip-content">
                <p className="tip-text">
                  Your stress stayed low throughout—this shows you're creating a safe internal space for yourself.
                </p>
              </div>
            </div>
            
            <div className="tip-card">
              <span className="tip-icon">💡</span>
              <div className="tip-content">
                <p className="tip-text">
                  If you want, try holding eye contact a bit longer. Aura noticed you looked away a few times—totally normal, and something we can practice together.
                </p>
              </div>
            </div>
          </div>
          
          <div className="summary-actions">
            <button 
              className="btn-primary-summary"
              onClick={() => navigate('/session')}
            >
              Practice again
            </button>
            <button 
              className="btn-secondary-summary"
              onClick={() => navigate('/modes')}
            >
              Find your community
            </button>
          </div>
        </GlassCard>
      </div>
      
      <style>{`
        .summary-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 120px);
          padding: 60px 48px;
        }
        
        .summary-card {
          max-width: 720px;
          width: 100%;
          padding: 40px;
        }
        
        .summary-title {
          font-size: 38px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 12px;
          text-align: center;
          letter-spacing: -0.02em;
        }
        
        .summary-subtitle {
          font-size: 16px;
          color: #5a6b7d;
          text-align: center;
          margin-bottom: 40px;
          line-height: 1.5;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 40px;
        }
        
        .metric-box {
          background: rgba(240, 245, 250, 0.6);
          padding: 20px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .metric-label {
          font-size: 13px;
          color: #5a6b7d;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        
        .metric-value {
          font-size: 20px;
          font-weight: 600;
          color: #2d3748;
        }
        
        .progress-section {
          margin-bottom: 40px;
          padding: 24px;
          background: rgba(250, 250, 255, 0.5);
          border-radius: 16px;
        }
        
        .section-label {
          font-size: 14px;
          font-weight: 600;
          color: #5a6b7d;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 20px;
        }
        
        .trend-placeholder {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          height: 80px;
          margin-bottom: 16px;
        }
        
        .trend-bar {
          flex: 1;
          border-radius: 8px 8px 0 0;
          transition: all 0.3s ease;
        }
        
        .trend-note {
          font-size: 14px;
          color: #5a6b7d;
          text-align: center;
          font-style: italic;
        }
        
        .tips-section {
          margin-bottom: 40px;
        }
        
        .tip-card {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: rgba(240, 245, 250, 0.5);
          border-radius: 16px;
          margin-bottom: 16px;
        }
        
        .tip-card:last-child {
          margin-bottom: 0;
        }
        
        .tip-icon {
          font-size: 22px;
          flex-shrink: 0;
          line-height: 1;
        }
        
        .tip-content {
          flex: 1;
        }
        
        .tip-text {
          font-size: 15px;
          color: #4a5568;
          line-height: 1.6;
          margin: 0;
        }
        
        .summary-actions {
          display: flex;
          gap: 16px;
        }
        
        .btn-primary-summary, .btn-secondary-summary {
          flex: 1;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-primary-summary {
          background: rgba(100, 120, 200, 0.85);
          color: white;
          box-shadow: 0 4px 16px rgba(100, 120, 200, 0.2);
        }
        
        .btn-primary-summary:hover {
          background: rgba(90, 110, 190, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(100, 120, 200, 0.3);
        }
        
        .btn-secondary-summary {
          background: rgba(255, 255, 255, 0.7);
          color: #4a5568;
          border: 1px solid rgba(200, 200, 220, 0.4);
        }
        
        .btn-secondary-summary:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .summary-container {
            padding: 40px 24px;
          }
          
          .summary-card {
            padding: 32px 24px;
          }
          
          .summary-title {
            font-size: 28px;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .summary-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </AppFrame>
  );
}