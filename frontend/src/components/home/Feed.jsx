import Posts from './post/Posts';
import { StoriesCircle } from './StoriesCircle';

const Feed = () => {
  return (
    <div>
      <div className='py-2'>
        <StoriesCircle />
      </div>
      <div className='w-full'>
        <Posts />
      </div>
    </div>
  );
};

export default Feed;
