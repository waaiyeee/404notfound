import type { CSSProperties, ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', style, onClick }: GlassCardProps) {
  return (
    <>
      <div 
        className={`glass-card ${className}`} 
        style={style}
        onClick={onClick}
      >
        {children}
      </div>
      
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        @media (max-width: 768px) {
          .glass-card {
            padding: 24px;
            border-radius: 20px;
          }
        }
      `}</style>
    </>
  );
}
