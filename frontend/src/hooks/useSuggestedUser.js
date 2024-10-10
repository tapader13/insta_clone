import { setSuggestedUser } from '@/app/auth/authSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useSuggestedUser = () => {
  const dispach = useDispatch();
  useEffect(() => {
    const getSuggestedUser = async () => {
      try {
        const res = await axios.get(
          'https://insta-clone-1-xpqt.onrender.com/api/v1/user/suggestuser',
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          console.log(res, 'suggested user');
          dispach(setSuggestedUser(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getSuggestedUser();
  }, []);
};
