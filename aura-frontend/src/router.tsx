import { createBrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Modes from './pages/Modes';
import Session from './pages/Session';
import Match from './pages/Match';
import Summary from './pages/Summary';
import Community from './pages/Community';

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
    path: '/match',
    element: <Match />,
  },
  {
    path: '/summary',
    element: <Summary />,
  },
  {
    path: '/community',
    element: <Community />,
  },
]);
