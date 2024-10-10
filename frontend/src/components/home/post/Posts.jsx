import { useSelector } from 'react-redux';
import Post from './Post';

const Posts = () => {
  const posts = useSelector((state) => state.post.posts);
  console.log(posts, 'posts');
  return (
    <div className='w-8/12 mx-auto '>
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
