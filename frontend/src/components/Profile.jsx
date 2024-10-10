import { useUserProfile } from '@/hooks/useUserProfile';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AiOutlineFile, AiOutlineSave } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { setFollow, setUnfollow } from '@/app/auth/authSlice';
import { MessageCircle, Heart } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();

  useUserProfile(id);

  const profileData = useSelector((state) => state.auth.selectedProfile);
  const [posts, setPosts] = useState([]);
  const profile = useSelector((state) => state.auth.user);
  console.log(profile, 'profile');
  console.log(profileData, 'profileData');
  const [tab, setTab] = useState('allposts');
  useEffect(() => {
    const getAllPost = async () => {
      try {
        const response = await axios.get(
          `https://insta-clone-1-xpqt.onrender.com/api/v1/post/${tab}/${id}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setPosts(response.data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getAllPost();
  }, [id, tab]);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const handleFollow = async (id) => {
    try {
      const response = await axios.post(
        `https://insta-clone-1-xpqt.onrender.com/api/v1/user/followunfollow/${id}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        if (response.data.message === 'Followed successfully!') {
          dispatch(
            setFollow({
              followkornewala: profile?._id,
              followlenewala: profileData?._id,
            })
          );
        }
        if (response.data.message === 'Unfollowed successfully!') {
          dispatch(
            setUnfollow({
              followkornewala: profile?._id,
              followlenewala: profileData?._id,
            })
          );
        }
        toast({
          variant: 'success',
          description: `${response.data.message}`,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const isFollow = useSelector((state) =>
    state.auth.user.following.includes(profileData._id)
  );
  console.log(isFollow, 'isfollow');
  return (
    <div className='w-full '>
      <div className='w-9/12 mx-auto grid grid-cols-12 my-10 '>
        <div className='col-span-4 w-full flex items-center justify-center '>
          <img
            className='h-[150px] w-[150px] border border-gray-200 rounded-full'
            src={profileData?.profilePic}
            alt='imgpro'
          />
        </div>
        <div className='col-span-8 w-full '>
          <div className='flex items-center gap-5'>
            <h2>{profileData?.username}</h2>
            {profileData?.username === profile?.username && (
              <Link to='/accounts/edit'>
                <Button variant='secondary'>Edit profile</Button>
              </Link>
            )}
            {profileData?.username !== profile?.username && (
              <>
                {isFollow ? (
                  <Button
                    onClick={() => handleFollow(profileData._id)}
                    variant='secondary'
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleFollow(profileData._id)}
                    className='bg-[#0095f6] hover:bg-[#0086d2] text-white'
                    variant='secondary'
                  >
                    Follow
                  </Button>
                )}
                <Button variant='secondary'>Message</Button>
              </>
            )}
          </div>
          <div className='flex gap-5 my-5'>
            <span className='text-gray-500'>
              <span className='font-bold text-black'>
                {profileData?.posts.length}
              </span>{' '}
              Posts
            </span>
            <span className='text-gray-500'>
              {' '}
              <span className='font-bold text-black'>
                {profileData?.followers.length}
              </span>{' '}
              Followers
            </span>
            <span className='text-gray-500'>
              {' '}
              <span className='font-bold text-black'>
                {profileData?.following.length}
              </span>{' '}
              Following
            </span>
          </div>
          <div>
            <Badge className={`cursor-pointer`} variant='secondary'>
              <span className='text-[18px]'>@</span>
              {profileData?.username}
            </Badge>
          </div>
          <div className='my-5'>
            <p>{profileData?.bio}</p>
          </div>
        </div>
      </div>
      <div className='w-9/12 mx-auto'>
        <hr className='border-gray-300' />
        <Tabs defaultValue={tab} onValueChange={setTab} className='w-full'>
          <TabsList className=''>
            <TabsTrigger value='allposts'>
              <AiOutlineFile className='mr-2' /> Posts
            </TabsTrigger>
            <TabsTrigger value='allbookmarks'>
              <AiOutlineSave className='mr-2' /> Saved
            </TabsTrigger>
          </TabsList>
          <TabsContent value='allposts'>
            <div className='grid grid-cols-3 gap-1'>
              {posts.map((post) => (
                <div className='h-[400px] group relative' key={post._id}>
                  <img
                    className='w-full h-full object-cover'
                    src={post.image}
                    alt=''
                  />
                  <div className='hidden group-hover:block transition-all duration-200 absolute inset-0 group-hover:bg-black group-hover:bg-opacity-10'>
                    <div className='flex h-full w-full items-center justify-center gap-5 z-10 relative'>
                      <div className='text-white flex items-center gap-2'>
                        <p>
                          <Heart />
                        </p>
                        <p>{post?.likes?.length}</p>
                      </div>
                      <div className='text-white flex items-center gap-2'>
                        <p>
                          <MessageCircle />
                        </p>
                        <p>{post?.comments?.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value='allbookmarks'>
            <div className='grid grid-cols-3 gap-1'>
              {posts.map((post) => (
                <div className='h-[400px] group relative' key={post._id}>
                  <img
                    className='w-full h-full object-cover'
                    src={post.image}
                    alt=''
                  />
                  <div className='hidden group-hover:block transition-all duration-200 absolute inset-0 group-hover:bg-black group-hover:bg-opacity-10'>
                    <div className='flex h-full w-full items-center justify-center gap-5 z-10 relative'>
                      <div className='text-white flex items-center gap-2'>
                        <p>
                          <Heart />
                        </p>
                        <p>{post?.likes?.length}</p>
                      </div>
                      <div className='text-white flex items-center gap-2'>
                        <p>
                          <MessageCircle />
                        </p>
                        <p>{post?.comments?.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
