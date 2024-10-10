import { setPost } from '@/app/post/postSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useAllPost = () => {
  const dispach = useDispatch();
  useEffect(() => {
    const getAllPost = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/post/all', {
          withCredentials: true,
        });
        if (res.data.success) {
          console.log(res);
          dispach(setPost(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllPost();
  }, []);
};
