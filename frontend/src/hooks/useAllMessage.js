import { setAllMessages } from '@/app/chat/chatSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useAllMessage = () => {
  const dispach = useDispatch();
  const { selectedUser } = useSelector((state) => state.auth);
  useEffect(() => {
    const getAllMessage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/message/all/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          console.log(res);
          dispach(setAllMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllMessage();
  }, [selectedUser]);
};
