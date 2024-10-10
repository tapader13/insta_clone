import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router-dom';

const SuggestedFollow = () => {
  const user = useSelector((state) => state.auth.user);
  const suggestUsers = useSelector((state) => state.auth.suggestedUser);

  return (
    <div className='ml-16'>
      <Link to={`/profile/${user?._id}`}>
        <div className='flex items-center gap-3 my-8'>
          <div>
            <Avatar className='w-12 h-12'>
              <AvatarImage src={`${user?.profilePic}`} alt='@shadcn' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className='font-bold'>{user?.username}</p>
          </div>
        </div>
      </Link>
      <div className='mt-5'>
        <div className='flex justify-between mb-5'>
          <p className='text-gray-400'>Suggested for you</p>
          <Link to='/explore/people'>
            <p className='font-bold'>See All</p>
          </Link>
        </div>
        {suggestUsers?.slice(0, 5).map((user) => (
          <div
            className='flex items-center justify-between gap-3 mb-3'
            key={user._id}
          >
            <Link to={`/profile/${user._id}`}>
              <div className='flex items-center gap-3'>
                <div>
                  <Avatar className='w-12 h-12'>
                    <AvatarImage src={`${user?.profilePic}`} alt='@shadcn' />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className='font-bold'>{user?.username}</p>
                </div>
              </div>
            </Link>
            <div>
              <p className='font-bold text-[#1DA1F2] cursor-pointer'>Follow</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedFollow;
