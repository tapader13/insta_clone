import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { useAllMessage } from '@/hooks/useAllMessage';
import { useMsgRTM } from '@/hooks/useMsgRTM';

const MessageComponent = ({ selectedUser }) => {
  useAllMessage();
  useMsgRTM();
  const { allMessages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className='p-5 flex flex-col h-full'>
      {/* Profile Section */}
      <div className='flex items-center justify-center flex-col gap-2'>
        <img
          className='w-14 h-14 rounded-full border border-gray-500'
          src={selectedUser?.profilePic}
          alt=''
        />
        <h3 className='font-semibold ml-3'>{selectedUser?.username}</h3>
        <Link to={`/profile/${selectedUser?._id}`}>
          <Button variant='secondary'>View Profile</Button>
        </Link>
      </div>

      {/* Chat Messages Section */}
      <div className='flex-1 mb-4'>
        {allMessages?.map((mesg, i) => (
          <div
            className={
              mesg.senderId === user?._id
                ? 'flex justify-end mb-2'
                : 'flex justify-start mb-2'
            }
            key={i}
          >
            {mesg.senderId === selectedUser?._id && (
              <img
                className='w-7 h-7 rounded-full mr-2'
                src={selectedUser?.profilePic}
                alt='pro'
              />
            )}
            <div
              className={
                mesg.senderId === user?._id
                  ? 'bg-[#1DA1F2] text-white py-2 px-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl max-w-xs'
                  : 'bg-gray-200 py-2 px-4 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl max-w-xs'
              }
            >
              <p>{mesg.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageComponent;
