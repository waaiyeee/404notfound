import { createBrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Modes from './pages/Modes';
import Session from './pages/Session';
import Community from './pages/Community';
import Chat from './pages/Chat';
import Summary from './pages/Summary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/modes',
    element: <Modes />,
  },
  {
    path: '/session',
    element: <Session />,
  },
  {
    path: '/community',
    element: <Community />,
  },
  {
    path: '/summary',
    element: <Summary />,
  },
  {
    path: '/chat/:userId',
    element: <Chat />,
  },
]);
