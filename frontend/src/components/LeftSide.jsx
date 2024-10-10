import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Bell,
  PlusCircle,
} from 'lucide-react';
import '../App.css';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRef, useState } from 'react';
import LeftSIdeMore from './LeftSIdeMore';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent } from './ui/dialog';
import { FaRegImages } from 'react-icons/fa';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { addPost } from '@/app/post/postSlice';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { removeNotification } from '@/app/notification/notificationSlice';

const LeftSide = () => {
  const user = useSelector((state) => state.auth.user);
  const navigationItems = [
    {
      icon: <Home />,
      text: 'Home',
    },
    {
      icon: <Search />,
      text: 'Search',
    },
    {
      icon: <Compass />,
      text: 'Explore',
    },
    {
      icon: <Film />,
      text: 'Reels',
    },
    {
      icon: <MessageCircle />,
      text: 'Messages',
    },
    {
      icon: <Bell />,
      text: 'Notifications',
    },
    {
      icon: <PlusCircle />,
      text: 'Create',
    },
    {
      icon: (
        <Avatar>
          <AvatarImage src={`${user?.profilePic}`} alt='@shadcn' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: user?.username,
    },
  ];
  const { toast } = useToast();
  const [activeItem, setActiveItem] = useState('Home');
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formDatas, setFormDatas] = useState({
    caption: '',
    image: null,
  });
  const imageRef = useRef();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [imgPreview, setImgPreview] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sideBarHandler = (state) => {
    setActiveItem(state);
    if (state === 'Create') {
      setModalOpen(true);
      setStep(1);
    }
    if (state === `${user?.username}`) {
      navigate(`/profile/${user?._id}`);
    }
    if (state === 'Home') {
      navigate('/');
    }
    if (state === 'Messages') {
      navigate('/direct/inbox');
    }
  };
  const handlePopoverOpenChange = (open) => {
    setIsPopoverOpen(open);
    if (!open) {
      dispatch(removeNotification());
    }
  };
  const handleOpen = (isOpen) => {
    setModalOpen(isOpen);
    if (!isOpen) {
      setFormDatas({
        caption: '',
        image: null,
      });

      setStep(1);

      setImgPreview('');
    }
  };
  const handlePostCreate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('caption', formDatas.caption);
      formData.append('image', formDatas.image);
      console.log(formDatas, 'data');
      const response = await axios.post(
        'https://insta-clone-1-xpqt.onrender.com/api/v1/post/addpost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(addPost(response.data.post));
        setModalOpen(false);
        setFormDatas({
          caption: '',
          image: null,
        });
        setImgPreview('');
        toast({
          variant: 'success',
          description: `${response.data.message}`,
        });
      }
    } catch (error) {
      console.log(error.message);
      toast({
        variant: 'destructive',
        description: `${error.response.data.message}`,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleNext = () => {
    if (step === 1 && formDatas.image) {
      setStep(2);
    } else if (step === 2) {
      handlePostCreate();
    }
  };

  const handleBack = () => {
    setStep(1);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormDatas({ ...formDatas, image: file });
    const reader = new FileReader();

    reader.onload = () => {
      setImgPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const { notifications } = useSelector((state) => state.notification);
  return (
    <div>
      <div className='p-2'>
        <div className='my-5'>
          <h1 className='m-3 font-damion font-bold text-4xl '>Instagram</h1>
        </div>
        {navigationItems.map((item) => (
          <div
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 cursor-pointer my-2 `}
            key={item.text}
            onClick={() => sideBarHandler(item.text)}
          >
            <span className={`${item.text === activeItem ? 'text-black' : ''}`}>
              {item.icon}
            </span>
            <span className={`${item.text === activeItem ? 'font-bold' : ''}`}>
              {item.text}
              {item.text === 'Notifications' && notifications.length > 0 && (
                <Popover
                  open={isPopoverOpen}
                  onOpenChange={handlePopoverOpenChange}
                >
                  <PopoverTrigger asChild>
                    <div className='relative'>
                      {notifications.length > 0 && (
                        <span className='bg-red-500 text-white rounded-full flex items-center justify-center absolute -top-7 -left-6 h-5 w-5 text-xs'>
                          {notifications.length}
                        </span>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className='w-64'>
                    <h3 className='font-bold mb-2'>Notifications</h3>
                    {notifications?.map((notif) => (
                      <div
                        key={notif?.senderId}
                        className='flex items-center gap-2 mb-2'
                      >
                        <Avatar>
                          <AvatarImage
                            src={notif?.userDetails?.profilePic}
                            alt={notif?.userDetails?.username}
                          />
                          <AvatarFallback>
                            {notif?.userDetails?.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <span className='font-bold'>
                            {notif?.userDetails?.username}
                          </span>
                          <span>{notif?.message}</span>
                        </div>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              )}
            </span>
          </div>
        ))}
        {
          <div className='mt-10'>
            <LeftSIdeMore />
          </div>
        }
        <Dialog open={modalOpen} onOpenChange={handleOpen}>
          <DialogContent className='sm:max-w-[425px] flex flex-col h-fit w-full pb-3 '>
            <div>
              <h4 className='text-center font-semibold py-3'>
                {step === 1 ? 'Create new post' : 'Add a caption'}
              </h4>
              <hr />
            </div>

            {step === 1 && (
              <div className='flex-grow flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center'>
                  <span className='text-3xl mt-3'>
                    <FaRegImages />
                  </span>
                  <p className='text-xl font-medium my-3'>
                    Drag photos and videos here
                  </p>
                  <div className='grid w-full  items-center gap-1.5'>
                    <Input
                      id='picture'
                      ref={imageRef}
                      onChange={handleFileChange}
                      className='bg-[#0095f6] text-white cursor-pointer hidden'
                      type='file'
                    />
                    {imgPreview && (
                      <img
                        src={imgPreview}
                        alt='preview'
                        className='w-[300px] h-[200px] '
                      />
                    )}
                    <Button
                      onClick={() => imageRef.current.click()}
                      className='bg-[#0095f6] text-white cursor-pointer '
                    >
                      Select from computer
                    </Button>
                    {formDatas.image && (
                      <Button onClick={handleNext}>Next</Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='flex flex-col mx-5'>
                <Textarea
                  placeholder='Write a caption...'
                  value={formDatas.caption}
                  onChange={(e) =>
                    setFormDatas({ ...formDatas, caption: e.target.value })
                  }
                />
                <div className='flex justify-between mt-4'>
                  <Button variant='secondary' onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    {loading ? 'Loading...' : 'Post'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default LeftSide;
