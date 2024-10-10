import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { useRef, useState } from 'react';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setUser } from '@/app/auth/authSlice';

const ProfileEdit = () => {
  const user = useSelector((state) => state.auth.user);
  // console.log(user, 'user');
  const [userData, setUserData] = useState({
    bio: user?.bio,
    gender: user?.gender,
    profilePic: user?.profilePic,
  });
  const imgRef = useRef();
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setUserData({ ...userData, profilePic: e.target.files[0] });
    }
  };
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('bio', userData.bio);
    formData.append('gender', userData.gender);
    formData.append('profilePic', userData.profilePic);
    console.log(formData, 'data');
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/user/profile/edit',
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(
          setUser({
            ...user,
            bio: userData.bio,
            gender: userData.gender,
            profilePic: userData.profilePic,
          })
        );
        toast({
          variant: 'success',
          description: `${response.data.message}`,
        });
        navigate(`/profile/${user?._id}`);
        console.log(response.data.message, 'data');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: `${error.response.data.message}`,
      });
    }
  };
  return (
    <div>
      <div className='w-1/2 mx-auto my-10'>
        <h3 className='font-bold text-xl mb-10'>Edit profile</h3>
        <div className='flex items-center justify-between mb-10 p-3 rounded-[15px] bg-gray-100'>
          <div className='flex items-center gap-5'>
            <img
              className='w-20 h-20 rounded-full border border-gray-300'
              src={userData?.profilePic}
              alt=''
            />
            <h4 className='font-bold'>@{user?.username}</h4>
          </div>
          <div>
            <input
              ref={imgRef}
              onChange={handleFileChange}
              type='file'
              name=''
              className='hidden'
              id=''
            />
            <Button
              onClick={() => imgRef.current.click()}
              className='font-bold bg-[#1DA1F2]'
            >
              Change Photo
            </Button>
          </div>
        </div>
        <div>
          <h4 className='font-bold mb-2 text-xl'>Bio</h4>
          <Textarea
            value={userData?.bio}
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
            placeholder='Type your bio here.'
          />
        </div>
        <div className='mt-10'>
          <h4 className='font-bold mb-2 text-xl'>Gender</h4>
          <Select
            defaultValue={userData?.gender}
            onValueChange={(value) =>
              setUserData({ ...userData, gender: value })
            }
            className='w-full'
          >
            <SelectTrigger className='w-full'>
              {' '}
              <SelectValue placeholder='Select a gender' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='text-right'>
          <Button onClick={handleSave} className='font-bold bg-[#1DA1F2] mt-10'>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
