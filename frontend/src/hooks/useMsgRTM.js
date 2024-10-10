import { setAllMessages } from '@/app/chat/chatSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useMsgRTM = () => {
  const dispach = useDispatch();
  const { socket } = useSelector((state) => state.chat);
  const { allMessages } = useSelector((state) => state.chat);
  useEffect(() => {
    socket?.on('getMessage', (data) => {
      // console.log(data, 'from rtm hook');
      dispach(setAllMessages([...allMessages, data]));
    });
    return () => {
      socket?.off('getMessage');
    };
  }, [setAllMessages, allMessages]);
};
