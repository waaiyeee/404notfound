import { Link } from 'react-router-dom';

export default function TopNav() {
  return (
    <>
      <nav className="top-nav">
        <div className="nav-left">
          <Link to="/modes" className="nav-link">Scenarios</Link>
          <Link to="/session" className="nav-link">Practice</Link>
        </div>
        
        <div className="nav-center">
          <Link to="/" className="nav-logo">Aura</Link>
        </div>
        
        <div className="nav-right">
          <Link to="/summary" className="nav-link nav-link-progress">Progress</Link>
        </div>
      </nav>
      
      <style>{`
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        }
        
        .nav-left, .nav-right {
          display: flex;
          gap: 32px;
          flex: 1;
        }
        
        .nav-right {
          justify-content: flex-end;
        }
        
        .nav-center {
          flex: 0 0 auto;
        }
        
        .nav-link {
          color: #4a5568;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.2s ease;
          letter-spacing: 0.01em;
        }
        
        .nav-link:hover {
          color: #2d3748;
        }
        
        .nav-link-progress {
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        
        .nav-logo {
          font-size: 20px;
          font-weight: 600;
          color: #2d3748;
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        
        @media (max-width: 768px) {
          .top-nav {
            padding: 20px 24px;
            gap: 16px;
          }
          
          .nav-left, .nav-right {
            gap: 16px;
            font-size: 14px;
          }
          
          .nav-logo {
            font-size: 18px;
          }
          
          .nav-left a:last-child {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
