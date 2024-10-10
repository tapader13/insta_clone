import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSelector } from 'react-redux';

const ExplorePeople = () => {
  const suggestUsers = useSelector((state) => state.auth.suggestedUser);
  return (
    <div className='mt-20'>
      <div className='mx-auto w-full max-w-xl'>
        <h3 className='font-bold mb-5'>Suggested</h3>
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

export default ExplorePeople;
