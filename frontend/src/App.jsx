import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import SignUp from './components/SignUp';
import HomeLayout from './components/HomeLayout';
import Login from './components/Login';
import Home from './components/home/Home';
import Profile from './components/Profile';
import 'react-toastify/dist/ReactToastify.css';
import ExplorePeople from './components/home/ExplorePeople';
import ProfileEdit from './components/ProfileEdit';
import ChatPage from './components/messages/ChatPage';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers, setSocket } from './app/chat/chatSlice';
import { setNotifications } from './app/notification/notificationSlice';
import Protected from './components/Protected';
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Protected>
        <HomeLayout />
      </Protected>
    ),
    children: [
      {
        path: '/',
        element: (
          <Protected>
            <Home />
          </Protected>
        ),
      },
      {
        path: '/profile/:id',
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
      },
      {
        path: '/accounts/edit',
        element: (
          <Protected>
            <ProfileEdit />
          </Protected>
        ),
      },
      {
        path: '/explore/people',
        element: (
          <Protected>
            <ExplorePeople />
          </Protected>
        ),
      },
      {
        path: '/direct/inbox',
        element: (
          <Protected>
            <ChatPage />
          </Protected>
        ),
      },
    ],
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
function App() {
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socket = io('https://insta-clone-1-xpqt.onrender.com', {
        query: {
          userId: user._id,
        },
        transports: ['websocket'],
      });
      dispatch(setSocket(socket));
      socket.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socket.on('notification', (notification) => {
        dispatch(setNotifications(notification));
      });
      socket.on('followNotification', (notification) => {
        dispatch(setNotifications(notification));
      });
      return () => {
        socket.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
