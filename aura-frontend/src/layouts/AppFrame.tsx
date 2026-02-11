import type { ReactNode } from "react";
import bg from "../assets/bg.webp";

interface AppFrameProps {
  children: ReactNode;
}

export default function AppFrame({ children }: AppFrameProps) {
  return (
    <div className="app-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="app-frame">{children}</div>

      <style>{`
        .app-container {
          min-height: 100vh;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          position: relative;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }

        .app-container::before {
          content: '';
          position: fixed;
          inset: 0;
          background: linear-gradient(
            120deg,
            rgba(10, 12, 24, 0.35),
            rgba(10, 12, 24, 0.12)
          );
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          z-index: 0;
        }

        .app-frame {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          min-height: calc(100vh - 48px);
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 14px 50px rgba(0, 0, 0, 0.18);
        }

        @media (max-width: 768px) {
          .app-container { padding: 16px; }
          .app-frame { border-radius: 20px; }
        }
      `}</style>
    </div>
  );
}
