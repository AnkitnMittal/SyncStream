import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Playback from './pages/Playback';
import { SocketProvider } from './context/SocketContext.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/room/:roomId',
    element: <Room />,
  },
  {
    path: '/playback/:roomId',
    element: <Playback />,
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
]);

export default function App() {
  return (
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  );
}
