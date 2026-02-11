import { createBrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Modes from './pages/Modes';
import Session from './pages/Session';
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
    path: '/summary',
    element: <Summary />,
  },
]);