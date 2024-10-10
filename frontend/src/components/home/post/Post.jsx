import { Bookmark, Heart, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { CommentDialog } from './CommentDialog';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import {
  addComment,
  removePost,
  setDislikes,
  setLikes,
} from '@/app/post/postSlice';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { removeBookmark, setBookmark } from '@/app/auth/authSlice';

const Post = ({ post }) => {
  const { toast } = useToast();
  const user = useSelector((state) => state.auth.user);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleComment = (e) => {
    if (e.target.value.trim()) {
      setComment(e.target.value);
    } else {
      setComment('');
    }
  };
  const dispatch = useDispatch();
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:8080/api/v1/post/delete/${id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(removePost(id));
        toast({
          variant: 'success',
          description: `${response.data.message}`,
        });
        setModalOpen(false);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: `${error.response.data.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikes = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/post/likedislike/${id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        if (response.data.message === 'Post disliked successfully!') {
          dispatch(setDislikes({ user: user._id, postId: id }));
        }
        if (response.data.message === 'Post liked successfully!') {
          dispatch(setLikes({ user: user._id, postId: id }));
        }
        toast({
          variant: 'success',
          description: `${response.data.message}`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: `${error.response.data.message}`,
      });
    }
  };
  const hasLiked = useSelector((state) =>
    state.post.posts.find((p) => p._id === post._id)?.likes.includes(user?._id)
  );
  const hasBookmarked = useSelector((state) =>
    state.auth.user?.bookmarks.find((p) => p === post._id)
  );
  const handleCommentSubmit = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/post/comment/${id}`,
        { text: comment },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(addComment({ postId: id, cid: response.data.comment._id }));
        toast({
          variant: 'success',
          description: `${response.data.message}`,
        });
        setComment('');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: `${error.response.data.message}`,
      });
    }
  };
  useUserProfile(post?.author?._id);
  const navigate = useNavigate();
  const handleProfile = () => {
    navigate(`/profile/${post?.author?._id}`);
  };
  const handleBookmark = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/post/bookmark/${id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        console.log(response, 'bookmark');
        if (response.data.type === 'unbookmark') {
          dispatch(removeBookmark({ postId: id }));
        }
        if (response.data.type === 'bookmark') {
          dispatch(setBookmark({ postId: id }));
        }
        toast({
          variant: 'success',
          description: `${response.data.message}`,
        });
      }
    } catch (error) {
      console.log(error, 'error');
      toast({
        variant: 'destructive',
        description: `${error.response.data.message}`,
      });
    }
  };
  return (
    <div className='mb-4'>
      <div className='flex justify-between items-center'>
        <div
          onClick={handleProfile}
          className='flex gap-3 items-center cursor-pointer'
        >
          <div className='w-10 h-10 rounded-full'>
            <img
              className=' h-full w-full rounded-full'
              src={post?.author?.profilePic}
              alt=''
            />
          </div>
          <div>
            <h5 className='font-semibold'>
              {post?.author?.username} <span className='mx-1'>.</span>{' '}
              <span className='text-gray-400'>
                {moment(post?.createdAt).fromNow()}
              </span>
            </h5>
            <p className='text-gray-400 text-sm'>
              {post?.author?.username === user?.username ? 'You' : ''}
            </p>
          </div>
        </div>

        <div>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger>
              <MoreHorizontal className='w-6 h-6' />
            </DialogTrigger>
            <DialogContent className='w-96'>
              <DialogHeader>
                <DialogTitle className='flex flex-col'>
                  <Button className='bg-white font-medium hover:bg-slate-100 text-gray-500 hover:text-red-500'>
                    Unfollow
                  </Button>
                  {post?.author?.username === user?.username ? (
                    <>
                      {' '}
                      <hr className='my-2' />
                      <Button
                        onClick={() => handleDelete(post?._id)}
                        className='bg-white hover:text-red-500 font-medium hover:bg-slate-100 text-gray-500'
                      >
                        Delete
                      </Button>
                    </>
                  ) : null}
                  <hr className='my-2' />
                  <Button className='bg-white hover:text-red-500 font-medium hover:bg-slate-100 text-gray-500'>
                    Go to post
                  </Button>
                </DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className='my-3 h-[550px]'>
        <img className='w-full h-full' src={post?.image} alt='' />
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <span
            className='cursor-pointer'
            onClick={() => handleLikes(post?._id)}
          >
            {hasLiked ? (
              <FaHeart className='w-6 h-6 text-red-500' />
            ) : (
              // <HeartFill className='w-6 h-6 text-red-500' />
              <Heart className='w-6 h-6' />
            )}
          </span>
          <span className='cursor-pointer'>
            <CommentDialog post={post} />
          </span>
        </div>
        <div onClick={() => handleBookmark(post?._id)} className='flex gap-2'>
          {hasBookmarked ? (
            <span className='cursor-pointer'>
              <FaBookmark className='w-6 h-6 ' />
            </span>
          ) : (
            <span className='cursor-pointer'>
              <Bookmark className='w-6 h-6 ' />
            </span>
          )}
        </div>
      </div>
      <p className=' font-semibold my-2'>
        {post?.likes?.length}
        <span className='ml-1'>likes</span>
      </p>
      <p>
        <span className='font-bold'>{post?.author?.username}</span>{' '}
        <span className='text-[rgba(0,0,0,1)]'>{post?.caption}</span>
      </p>
      {/* <p className='text-gray-400 cursor-pointer'></p> */}
      {post?.comments?.length > 0 && (
        <CommentDialog
          post={post}
          text={`View all ${post?.comments?.length} comments`}
        />
      )}

      <div className='my-2'>
        <div className='relative'>
          <input
            type='text'
            value={comment}
            onChange={handleComment}
            className='w-full pb-3 rounded-lg border-b border-gray-300 focus:outline-none'
            placeholder='Add a comment...'
          />
          {comment && (
            <button
              onClick={() => handleCommentSubmit(post?._id)}
              type='submit'
              className='absolute right-3 top-0 mb-3 text-[17px] font-semibold text-blue-500 rounded-lg hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
