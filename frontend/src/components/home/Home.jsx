import { useAllPost } from '@/hooks/useAllPost';
import Feed from './Feed';
import SuggestedFollow from './SuggestedFollow';
import { useSuggestedUser } from '@/hooks/useSuggestedUser';

const Home = () => {
  useAllPost();
  useSuggestedUser();
  return (
    <div className=' w-full'>
      <div className=' grid grid-cols-[1fr_300px] w-10/12 mx-auto '>
        <div className=''>
          <Feed />
        </div>
        <div className=''>
          <SuggestedFollow />
        </div>
      </div>
    </div>
  );
};

export default Home;
