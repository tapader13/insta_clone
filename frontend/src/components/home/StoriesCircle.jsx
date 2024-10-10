import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

export function StoriesCircle() {
  return (
    <Carousel className=''>
      <CarouselContent className='-ml-1'>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem
            key={index}
            className='pl-1 md:basis-1/2 lg:basis-[12.5%] '
          >
            <div className='p-1 flex flex-col items-center '>
              <div className='text-2xl items-center  justify-center flex bg-white font-semibold w-full h-20 rounded-full border  border-red-500 p-1'>
                <Avatar className='h-full w-full'>
                  <AvatarImage
                    src='https://github.com/shadcn.png'
                    alt='@shadcn'
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <h4>minhaj</h4>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
