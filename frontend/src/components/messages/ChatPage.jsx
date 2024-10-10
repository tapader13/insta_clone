import { setSelectedUser } from '@/app/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import MessageComponent from './MessageComponent';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { MessageCircleMore } from 'lucide-react';
import axios from 'axios';
import { setAllMessages } from '@/app/chat/chatSlice';

const ChatPage = () => {
  const { user, suggestedUser, selectedUser } = useSelector(
    (state) => state.auth
  );
  const { onlineUsers } = useSelector((state) => state.chat);
  const isActive = onlineUsers.includes(selectedUser?._id);
  const dispatch = useDispatch();
  const handleSugUser = (usr) => {
    dispatch(setSelectedUser(usr));
  };
  const [message, setMessage] = useState('');
  const { allMessages } = useSelector((state) => state.chat);
  const handleSubmit = async () => {
    if (message.trim() !== '') {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/v1/message/send/${selectedUser._id}`,
          {
            message,
          },
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setAllMessages([...allMessages, response.data.newMessage]));
          console.log(response.data, 'response');
          setMessage('');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);
  return (
    <div>
      <div className='grid grid-cols-[300px_1fr]'>
        <div className='border-r flex flex-col  border-gray-300 h-screen px-5'>
          <h2 className='font-bold text-xl my-8'>{user?.username}</h2>
          <div>
            <img
              className='w-20 h-20 rounded-full border border-gray-500'
              src={user?.profilePic}
              alt=''
            />
          </div>
          <p className='font-bold my-5'>Messages</p>
          <div className='overflow-y-auto flex flex-col'>
            {suggestedUser?.map((sugUser) => {
              const isOnline = onlineUsers.includes(sugUser._id);
              return (
                <div
                  onClick={() => handleSugUser(sugUser)}
                  key={sugUser._id}
                  className='flex cursor-pointer items-center gap-5'
                >
                  <div className='relative'>
                    <img
                      className='w-10 h-10 rounded-full'
                      src={sugUser?.profilePic}
                      alt=''
                    />
                    {isOnline ? (
                      <div className='w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-0'></div>
                    ) : null}
                  </div>
                  <div>
                    <p>{sugUser?.username}</p>
                    <p className='text-gray-500 text-xs'>
                      {isOnline ? 'Active now' : 'Last seen 1 min ago'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className='h-screen'>
          {selectedUser ? (
            <div className='flex flex-col h-full'>
              <div className='sticky bg-white top-0 border-b border-gray-300 z-10'>
                <div className='flex cursor-pointer items-center p-5 gap-5'>
                  <div className='relative'>
                    <img
                      className='w-10 h-10 rounded-full'
                      src={selectedUser?.profilePic}
                      alt=''
                    />
                    {isActive ? (
                      <div className='w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-0'></div>
                    ) : null}
                  </div>
                  <div>
                    <p>{selectedUser?.username}</p>
                    <p className='text-gray-500 text-xs'>
                      {isActive ? 'Active now' : 'Last seen 1 min ago'}
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex-1 overflow-y-auto'>
                <MessageComponent selectedUser={selectedUser} />
              </div>
              <div className='p-5 relative border-t border-gray-300'>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type='text'
                  className='focus-visible:ring-transparent'
                  placeholder='Message...'
                />
                {message.trim() !== '' ? (
                  <Button
                    onClick={handleSubmit}
                    className='absolute bg-transparent hover:bg-transparent font-medium text-[#1DA1F2] top-1/2 right-5 -translate-y-1/2'
                  >
                    Send
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <>
              <div className='flex flex-col items-center justify-center h-full'>
                <span className='h-24 w-24'>
                  <MessageCircleMore className='w-full h-full' />
                </span>
                <h3 className='font-bold text-2xl'>
                  Select a user to start chatting
                </h3>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
