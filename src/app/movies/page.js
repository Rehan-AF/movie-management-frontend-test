'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AddIcon from '@/assets/icons/AddIcon.png';
import logout from '@/assets/icons/logout.png';
import axios from 'axios';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearToken, clearUserInfo } from '@/redux/userSlice/userSlice';
import verifyToken from '@/utils/auth';
import { Menu } from '@headlessui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Link from 'next/link';
const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector((state) => state.user.token, shallowEqual);
  useEffect(() => {
    const checkToken = () => {
      const _token = token || localStorage.getItem('token');
      if (_token) {
        const isValid = verifyToken(_token);
        if (!isValid) {
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
  }, [token]);

  const getAllMovies = async (page) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/movies`,
        {
          params: { page, limit: 8 },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      setMovies((prevMovies) => {
        if (
          JSON.stringify(prevMovies) !== JSON.stringify(response.data.movies)
        ) {
          return response.data.movies;
        }
        return prevMovies;
      });
      setTotalPages((prev) =>
        prev !== response.data.totalPages ? response.data.totalPages : prev
      );
    } catch (err) {
      console.error(err);
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMovies(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#093545]">
      {loading ? (
        <div className="h-[100vh] w-[100vw] flex justify-center items-center">
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
        </div>
      ) : movies.length === 0 ? (
        <EmptyState />
      ) : (
        <MoviesPage
          movies={movies}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          loading={loading}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">

      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
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

      <h1 className="text-2xl font-semibold text-white md:text-3xl">
        Your movie list is empty
      </h1>
      <button className="mt-4 rounded-lg bg-[#2BD17E] px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-emerald-600">
        Add a new movie
      </button>
    </div>
  );
};

const MoviesPage = ({
  movies,
  handleNextPage,
  handlePrevPage,
  loading,
  totalPages,
  currentPage,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(clearUserInfo());
    localStorage.removeItem('token');
    router.push('/auth/login');
  };
  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 3) pages.push(1, '...');
      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...', totalPages);
    }

    return pages;
  };

  const pages = getPages();
  return (
    <div className=" relative">
      {/* Header */}

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
      <div className=" mx-auto px-6 py-8 lg:max-w-[83%]">
        <div className="flex items-center justify-between text-white lg:py-[6rem] ">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-[2rem] font-semibold lg:text-[4rem]">
              My movies
            </h1>
            <Link href="/movies/create">
              <Image
                src={AddIcon || '/placeholder.svg'}
                alt="addIcon"
                className=" h-[1.5rem]  w-[1.5rem] rounded-lg lg:h-[32px] lg:w-[32px] object-contain"
              />
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-[1rem] font-medium leading-5 "
          >
            Logout{' '}
            <span>
              <Image
                src={logout || '/placeholder.svg'}
                alt="addIcon"
                className=" h-[1.5rem]  w-[1.5rem] rounded-lg lg:h-[32px] lg:w-[32px]"
              />
            </span>
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4  lg:grid-cols-4">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="relative rounded-xl bg-[#092C39] p-2 shadow-md"
            >
              <Image
                src={movie.poster || '/placeholder.svg'}
                alt={movie.title}
                width={500}
                height={500}
                className="mb-4 h-[400px] w-full rounded-xl object-cover"
              />
              <h2 className="mb-2 text-[20px] font-bold leading-8 text-white">
                {movie.title}
              </h2>
              <p className="mb-4 text-sm  leading-6 text-gray-300">
                {movie.publishingYear}
              </p>

              <Menu as="div" className="absolute right-2 top-2">
                <Menu.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:text-white focus:outline-none">
                  <BsThreeDotsVertical className="h-5 w-5" aria-hidden="true" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-[#092C39] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={{
                            pathname: `/movies/${movie._id}/edit`,
                            query: { id: movie._id },
                          }}
                          className={`${
                            active ? 'bg-[#0c3b4e] text-white' : 'text-gray-300'
                          } block w-full px-4 py-2 text-left text-sm`}
                        >
                          Edit
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="my-[4rem] flex items-center justify-center gap-2 py-4">
          <button
            className={`px-3 py-2 font-semibold ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-white '
            }`}
            onClick={() => handlePrevPage()}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            Prev
          </button>

          {pages.map((page, index) =>
            page === '...' ? (
              <span
                key={index}
                className="px-2 py-1 text-gray-400 cursor-default"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`px-4 py-2 rounded-md ${
                  page === currentPage
                    ? 'bg-green-500 text-white font-bold'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className={`px-3 py-2 font-semibold ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-white'
            }`}
            onClick={() => handleNextPage()}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
