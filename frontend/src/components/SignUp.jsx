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
import { useSelector } from 'react-redux';
const formSchema = z
  .object({
    username: z.string().min(4, {
      message: 'at least 4 characters',
    }),
    email: z.string().email(),
    password: z.string().min(4, {
      message: 'at least 4 characters',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
const SignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [loding, setLoding] = useState(false);
  const handleForm = async (data) => {
    try {
      setLoding(true);
      const response = await axios.post(
        'http://localhost:8080/api/v1/user/register',
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
        form.reset();
        navigate('/login');
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
    // console.log(data);
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
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='Username' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Confirm Password'
                    {...field}
                  />
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
              Sign Up
            </Button>
          )}
          <p className='text-center text-sm text-gray-500'>
            Already have an account?{' '}
            <Link
              className='ml-1 hover:underline hover:text-blue-500'
              to='/login'
            >
              Login here
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
