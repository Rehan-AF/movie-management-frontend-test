'use client';

import { clearToken, clearUserInfo } from '@/redux/userSlice/userSlice';
import verifyToken from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

const Page = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token, shallowEqual);

  useEffect(() => {
    const checkToken = () => {
      const _token = token || localStorage.getItem('token');
      if (_token) {
        const isValid = verifyToken(_token);
        if (isValid) {
          router.push('/movies');
        } else {
          dispatch(clearToken());
          dispatch(clearUserInfo());
          localStorage.removeItem('token');
          router.push('/auth/login'); 
        }
      } else {
        router.push('/auth/login'); 
      }
    };

    checkToken();
  }, [token, dispatch, router]);

  return (
    <div>
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#093545]">
        <svg
          className="animate-spin h-5 w-5 text-white mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-[110px]"
          viewBox="0 0 1440 111"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 0L59.625 4.17052C120.375 8.34104 239.625 16.6821 360 30.7977C480.375 45.2341 599.625 65.7659 720 69.9364C840.375 74.1069 959.625 61.5954 1080 57.7457C1200.38 53.5751 1319.62 57.7457 1380.38 59.6705L1440 61.5954V111H1380.38C1319.62 111 1200.38 111 1080 111C959.625 111 840.375 111 720 111C599.625 111 480.375 111 360 111C239.625 111 120.375 111 59.625 111H0V0Z"
            fill="#20DF7F"
            fillOpacity="0.09"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 44.4L48 53.28C96 62.16 192 79.92 288 75.48C384 71.04 480 44.4 576 26.64C672 8.88 768 0 864 0C960 0 1056 8.88 1152 24.42C1248 39.96 1344 62.16 1392 73.26L1440 84.36V111H1392C1344 111 1248 111 1152 111C1056 111 960 111 864 111C768 111 672 111 576 111C480 111 384 111 288 111C192 111 96 111 48 111H0V44.4Z"
            fill="#E5E5E5"
            fillOpacity="0.13"
          />
        </svg>
      </div>
    </div>
  );
};

export default Page;
