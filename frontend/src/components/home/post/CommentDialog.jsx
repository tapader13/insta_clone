import { addComment, setDislikes, setLikes } from '@/app/post/postSlice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaBookmark, FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

export function CommentDialog({ post, text }) {
  const [allComments, setAllComments] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const handleComment = (e) => {
    if (e.target.value.trim()) {
      setComment(e.target.value);
    } else {
      setComment('');
    }
  };
  useEffect(() => {
    const getCommentsOfPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/post/comment/all/${post._id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setAllComments(response.data.comments);
        }
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };
    getCommentsOfPost();
  }, [post]);
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
  // console.log(post, 'post');
  const handleLikes = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/post/likedislike/${id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        console.log(response, 'response');
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {text ? (
          <p className='text-gray-400 cursor-pointer'>{text}</p>
        ) : (
          <MessageCircle className='w-6 h-6' />
        )}
      </DialogTrigger>
      <DialogContent className='sm:w-8/12 grid grid-cols-2'>
        <div>
          <img
            className='w-full  h-full max-h-[500px]'
            src={post?.image}
            alt=''
          />
        </div>
        <div className='p-2 flex flex-col justify-between'>
          <div className='flex justify-between gap-3 items-center'>
            <div className='flex gap-3 items-center'>
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
                    {' '}
                    {moment(post?.createdAt).fromNow()}
                  </span>
                </h5>
                <p className='text-gray-400 text-sm'>
                  {' '}
                  {post?.author?.username === user?.username ? 'You' : ''}
                </p>
              </div>
            </div>
            <div>
              <Dialog>
                <DialogTrigger>
                  <MoreHorizontal className='w-6 h-6' />
                </DialogTrigger>
                <DialogContent className='w-96'>
                  <DialogHeader>
                    <DialogTitle className='flex flex-col'>
                      <Button className='bg-white font-medium hover:bg-slate-100 text-gray-500 hover:text-red-500'>
                        Unfollow
                      </Button>
                      {/* {post?.author?.username === user?.username ? (
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
                      ) : null} */}
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
          <hr className='mt-3' />
          <ScrollArea className='h-[300px]'>
            {allComments?.map((comment, i) => (
              <div key={i} className='flex justify-between items-center mb-2'>
                <div className='grid grid-cols-[10%_1fr] gap-3 '>
                  <div className=' rounded-full'>
                    <img
                      className=' h-10 w-10 rounded-full'
                      src={comment?.author?.profilePic}
                      alt=''
                    />
                  </div>
                  <div>
                    <p>
                      <span className='font-bold'>
                        {comment?.author?.username}
                      </span>{' '}
                      <span className='text-[rgba(0,0,0,1)]'>
                        {comment?.text}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <Heart className='w-4 h-4' />
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className=''>
            <hr className='mb-3' />
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
                {/* <span className='cursor-pointer'>
                  <CommentDialog post={post} />
                </span> */}
              </div>
              <div className='flex gap-2'>
                <span className='cursor-pointer'>
                  <Bookmark className='w-6 h-6 ' />
                </span>
                <span className='cursor-pointer'>
                  <FaBookmark className='w-6 h-6 ' />
                </span>
              </div>
            </div>
            <p className=' font-semibold my-2'>
              {post?.likes?.length} <span className='ml-1'>likes</span>
            </p>
            <hr className='my-3' />
            <div className='mt-2'>
              <div className='relative'>
                <input
                  type='text'
                  value={comment}
                  onChange={handleComment}
                  className='w-full pb-1 rounded-lg  focus:outline-none'
                  placeholder='Add a comment...'
                />
                {comment && (
                  <button
                    onClick={() => handleCommentSubmit(post?._id)}
                    type='submit'
                    className='absolute right-3 top-0 mb-1 text-[17px] font-semibold text-blue-500 rounded-lg hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
