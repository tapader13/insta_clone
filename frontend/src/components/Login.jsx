import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/app/auth/authSlice';
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, {
    message: 'at least 4 characters',
  }),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [loding, setLoding] = useState(false);
  const dispatch = useDispatch();
  const handleForm = async (data) => {
    try {
      setLoding(true);
      const response = await axios.post(
        'http://localhost:8080/api/v1/user/login',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast({
          variant: 'success',
          description: `${response.data.message}`,
        });
        dispatch(setUser(response.data.user));
        form.reset();
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
      toast({
        variant: 'destructive',
        description: `${error.response.data.message}`,
      });
    } finally {
      setLoding(false);
    }
  };
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);
  return (
    <div className='flex items-center justify-center h-screen w-screen'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleForm)}
          className=' max-w-md flex flex-col shadow-md p-5 rounded-lg  gap-4 w-full'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='Email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loding ? (
            <Button type='submit' className='w-full' disabled>
              Loading...
            </Button>
          ) : (
            <Button type='submit' className='w-full'>
              Login
            </Button>
          )}
          <p className='text-center text-sm text-gray-500'>
            Don&apos;t have an account?{' '}
            <Link
              className='ml-1 hover:underline hover:text-blue-500'
              to='/signup'
            >
              Sign up here
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default Login;
