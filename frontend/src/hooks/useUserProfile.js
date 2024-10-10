import { setSelectedProfile } from '@/app/auth/authSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useUserProfile = (id) => {
  const dispach = useDispatch();
  useEffect(() => {
    const getAllPost = async () => {
      try {
        const res = await axios.get(
          `https://insta-clone-1-xpqt.onrender.com/api/v1/user/profile/${id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispach(setSelectedProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllPost();
  }, []);
};
