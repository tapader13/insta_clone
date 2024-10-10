import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/app/auth/authSlice';

const LeftSIdeMore = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispach = useDispatch();
  const handleLogOut = async () => {
    try {
      const response = await axios.get(
        'https://insta-clone-1-xpqt.onrender.com/api/v1/user/logout'
      );
      if (response.data.success) {
        toast({
          variant: 'success',
          description: `${response.data.message}`,
        });
        dispach(setUser(null));
        navigate('/login');
      }
    } catch (error) {
      console.log(error.message);
      toast({
        variant: 'destructive',
        description: `${error.response.data.message}`,
      });
    }
  };
  return (
    <div className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 cursor-pointer my-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center gap-3'>
            <span>
              <Menu />
            </span>
            <span>More</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuGroup>
            <DropdownMenuItem className='cursor-pointer my-2 p-3'>
              Saved
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer my-2 p-3'>
              Mode
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleLogOut()}
            className='cursor-pointer my-2 p-3'
          >
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LeftSIdeMore;
