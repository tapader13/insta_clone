import { Outlet } from 'react-router-dom';
import LeftSide from './LeftSide';

const HomeLayout = () => {
  return (
    <div>
      <div className='grid grid-cols-[200px_1fr] min-h-screen'>
        <div className='border-r h-full border-nutral-500 '>
          <div className='fixed'>
            <LeftSide />
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
