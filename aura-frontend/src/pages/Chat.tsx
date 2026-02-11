import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppFrame from '../layouts/AppFrame';
import TopNav from '../components/TopNav';
import GlassCard from '../components/ui/GlassCard';

interface Message {
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  compatibility: number;
  interests: string[];
}

// Mock user data
const MOCK_USERS: Record<string, UserProfile> = {
  alex_m: {
    id: 'alex_m',
    name: 'Alex M.',
    avatar: '🎮',
    bio: 'Enjoys deep conversations about anime and gaming',
    compatibility: 92,
    interests: ['anime', 'games']
  },
  jordan_l: {
    id: 'jordan_l',
    name: 'Jordan L.',
    avatar: '🎨',
    bio: 'Artist who loves sharing thoughts on music',
    compatibility: 87,
    interests: ['music', 'art']
  },
  sam_k: {
    id: 'sam_k',
    name: 'Sam K.',
    avatar: '💪',
    bio: 'Fitness enthusiast looking for workout buddies',
    compatibility: 85,
    interests: ['sports', 'fitness']
  },
  taylor_r: {
    id: 'taylor_r',
    name: 'Taylor R.',
    avatar: '🎯',
    bio: 'Gamer and anime fan',
    compatibility: 83,
    interests: ['games', 'anime']
  },
};

// Mock conversation starters based on user
const MOCK_RESPONSES: Record<string, string[]> = {
  alex_m: [
    "Hey! Thanks for reaching out! I've been playing a lot of RPGs lately. What about you?",
    "That sounds awesome! Have you watched any good anime recently?",
    "I totally get that! It's nice to find someone who shares similar interests.",
    "Haha yeah! Maybe we could play something together sometime?",
    "Sounds great! Looking forward to chatting more!"
  ],
  jordan_l: [
    "Hi there! I've been working on some digital art lately. Do you have any creative hobbies?",
    "That's really cool! I love discovering new music. What genres are you into?",
    "I appreciate that! It's always nice to meet people with similar communication styles.",
    "Absolutely! I find that art and conversation go hand in hand.",
    "Thanks for the chat! Let's keep in touch!"
  ],
  sam_k: [
    "Hey! Always good to meet someone new. Been hitting the gym a lot lately.",
    "Nice! What kind of workouts do you usually do?",
    "That's cool! I think staying active helps with social confidence too.",
    "For sure! Maybe we could motivate each other.",
    "Sounds good! Take care!"
  ],
  taylor_r: [
    "Hey! Saw we have similar interests. What games are you into?",
    "Oh nice! I've been binge-watching some anime too. Which ones?",
    "Haha I know right! The storylines are so complex.",
    "Definitely! We should compare notes on shows sometime.",
    "Cool talking to you! Catch you later!"
  ],
};

export default function Chat() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [responseIndex, setResponseIndex] = useState(0);

  const user = userId ? MOCK_USERS[userId] : null;
  const responses = userId ? MOCK_RESPONSES[userId] : [];

  useEffect(() => {
    if (user) {
      // Initial greeting from the matched user
      setMessages([
        {
          sender: 'them',
          text: `Hi! I'm ${user.name}. Aura matched us because we have a ${user.compatibility}% compatibility. ${user.bio}. How's it going?`,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }
      ]);
    }
  }, [user]);

  const handleSend = () => {
    if (!message.trim() || !user) return;

    // Add user's message
    const userMsg: Message = {
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage('');

    // Simulate response after a delay
    setTimeout(() => {
      const response = responses[responseIndex % responses.length];
      const theirMsg: Message = {
        sender: 'them',
        text: response,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages(prev => [...prev, theirMsg]);
      setResponseIndex(prev => prev + 1);
    }, 1000);
  };

  if (!user) {
    return (
      <AppFrame>
        <TopNav />
        <div style={{ padding: '60px 48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', color: '#2d3748' }}>User not found</h1>
          <button 
            onClick={() => navigate('/community')}
            style={{ marginTop: '20px', padding: '12px 24px', background: 'rgba(100, 120, 200, 0.85)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
          >
            Back to Community
          </button>
        </div>
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <TopNav />
      
      <div className="chat-container">
        <div className="chat-wrapper">
          <GlassCard className="chat-card">
            {/* Chat Header */}
            <div className="chat-header">
              <button className="btn-back" onClick={() => navigate('/community')}>
                ← Back
              </button>
              <div className="user-info">
                <span className="user-avatar">{user.avatar}</span>
                <div>
                  <h2 className="user-name">{user.name}</h2>
                  <p className="user-compatibility">{user.compatibility}% match</p>
                </div>
              </div>
              <div className="user-interests">
                {user.interests.map((interest, idx) => (
                  <span key={idx} className="interest-tag">{interest}</span>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.sender}`}>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                  <span className="message-time">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="input-section">
              <input
                type="text"
                className="message-input"
                placeholder={`Message ${user.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn-send" onClick={handleSend}>
                Send
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
      
      <style>{`
        .chat-container {
          padding: 32px 48px;
          min-height: calc(100vh - 120px);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .chat-wrapper {
          width: 100%;
          max-width: 800px;
        }
        
        .chat-card {
          padding: 0;
          display: flex;
          flex-direction: column;
          height: 700px;
          overflow: hidden;
        }
        
        .chat-header {
          padding: 24px;
          border-bottom: 1px solid rgba(200, 200, 220, 0.3);
          background: rgba(250, 252, 255, 0.5);
        }
        
        .btn-back {
          background: transparent;
          border: none;
          color: #5a6b7d;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 16px;
          padding: 4px 0;
          transition: color 0.2s ease;
        }
        
        .btn-back:hover {
          color: #2d3748;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }
        
        .user-avatar {
          font-size: 48px;
        }
        
        .user-name {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 4px 0;
        }
        
        .user-compatibility {
          font-size: 14px;
          color: #5a6b7d;
          margin: 0;
        }
        
        .user-interests {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .interest-tag {
          background: rgba(100, 120, 200, 0.1);
          color: #4a5568;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .chat-message {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .chat-message.me {
          align-items: flex-end;
        }
        
        .chat-message.them {
          align-items: flex-start;
        }
        
        .message-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          max-width: 70%;
          font-size: 14px;
          line-height: 1.5;
          color: #2d3748;
        }
        
        .chat-message.me .message-bubble {
          background: rgba(100, 120, 200, 0.2);
        }
        
        .chat-message.them .message-bubble {
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .message-time {
          font-size: 11px;
          color: #a0aec0;
          padding: 0 8px;
        }
        
        .input-section {
          padding: 20px 24px;
          border-top: 1px solid rgba(200, 200, 220, 0.3);
          background: rgba(250, 252, 255, 0.5);
          display: flex;
          gap: 12px;
        }
        
        .message-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid rgba(200, 200, 220, 0.4);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          color: #2d3748;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .message-input:focus {
          border-color: rgba(100, 120, 200, 0.5);
          background: rgba(255, 255, 255, 1);
        }
        
        .btn-send {
          padding: 12px 32px;
          background: rgba(100, 120, 200, 0.85);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(100, 120, 200, 0.2);
        }
        
        .btn-send:hover {
          background: rgba(90, 110, 190, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(100, 120, 200, 0.3);
        }
        
        @media (max-width: 768px) {
          .chat-container {
            padding: 20px;
          }
          
          .chat-card {
            height: calc(100vh - 160px);
          }
          
          .message-bubble {
            max-width: 85%;
          }
        }
      `}</style>
    </AppFrame>
  );
}
