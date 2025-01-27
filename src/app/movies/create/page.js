'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowDownToLine } from 'lucide-react';
import axios from 'axios';
import { useSelector, shallowEqual } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { FaCheckCircle } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import Link from 'next/link';
import verifyToken from '@/utils/auth';
import { clearToken, clearUserInfo } from '@/redux/userSlice/userSlice';

export default function CreateMovie() {
  const [title, setTitle] = useState('');
  const [publishingYear, setPublishingYear] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
  });
  useEffect(() => {
    if (!success) return;

    const timeout = setTimeout(() => {
      setSuccess(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [success]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    if (!title || !publishingYear || !image) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('publishingYear', publishingYear);
    formData.append('poster', image); // Append the image

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/movies`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      setSuccess(true);
      setTitle('');
      setPublishingYear('');
      setImage(null);
      setPreview(null);
      setError(null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Error posting movie:', err);
      setError('Failed to post the movie. Please try again.');
    }
  };
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-[#093545]">
      <div className="w-full pt-[3rem] pl-[3rem]">
        <Link href="/movies">
          <button className="flex-1 rounded-full bg-[#2BD17E] p-3 font-medium text-white transition-colors hover:bg-[#2BD17E]/90">
            <IoArrowBack />
          </button>
        </Link>
      </div>
      <svg
        className="fixed bottom-0 left-0 right-0 w-full h-[110px]"
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

      <div className="z-10 w-full px-5 sm:px-6 md:max-w-6xl">
        {success && (
          <div className="rounded-md absolute w-[50%] left-[50%] mt-5 bg-green-50 p-4 transform -translate-x-1/2">
            <div className="flex">
              <div className="shrink-0">
                <FaCheckCircle
                  aria-hidden="true"
                  className="size-5 text-green-400"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Successfully uploaded
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                  >
                    <span className="sr-only">Dismiss</span>
                    <IoMdClose aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <h1 className="mb-6 text-start text-2xl font-semibold text-white sm:text-3xl md:mb-8 md:text-4xl py-11 lg:py-[3rem]">
          Create a new movie
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[7rem]">
            {/* Form Fields - Now first on mobile */}
            <div className="order-1 space-y-4 sm:space-y-6 md:order-2">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 w-full rounded-[0.7rem] border-0 bg-[#224957] px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:!ring-2 focus:!ring-[#2BD17E] md:max-w-[362px]"
                required
              />

              <input
                type="number"
                placeholder="Publishing year"
                value={publishingYear}
                onChange={(e) => setPublishingYear(e.target.value)}
                className="h-12 w-full rounded-[0.7rem] border-0 bg-[#224957] px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#2BD17E] md:max-w-[216px]"
                required
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className="md:flex flex-col gap-3 pt-6 sm:flex-row sm:gap-4 sm:pt-[3rem] hidden">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 rounded-[0.6rem] border border-white bg-transparent px-6 py-3 text-white transition-colors hover:bg-white/5 md:max-w-[167px]"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-1 rounded-[0.6rem] bg-[#2BD17E] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2BD17E]/90 md:max-w-[179px]"
                >
                  {loading ? (
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
                  ) : (
                    <span className="py-4 text-[1rem] font-bold text-white">
                      Submit
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Image Upload - Now second on mobile */}
            <div
              {...getRootProps()}
              className="relative order-2 flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white bg-[#224957]/50 transition-colors hover:border-[#2BD17E]/50 sm:max-w-md md:order-1 md:max-w-[476px]"
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="relative h-full w-full">
                  <img
                    src={preview || '/placeholder.svg'}
                    alt="Preview"
                    className="h-full w-full rounded-lg object-cover"
                    onLoad={() => {
                      URL.revokeObjectURL(preview);
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white">
                  <ArrowDownToLine className="mb-2 h-6 w-6 sm:h-8 sm:w-8" />
                  <p className="text-center text-sm">Upload an image here</p>
                </div>
              )}
            </div>
            <div className="flex  gap-3 pt-6 flex-row sm:gap-4 sm:pt-[3rem] md:hidden order-2">
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 rounded-[0.6rem] border border-white bg-transparent px-6 py-3 text-white transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                type="submit"
                className="flex-1 rounded-[0.6rem] bg-[#2BD17E] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2BD17E]/90"
              >
                {loading ? (
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
                ) : (
                  <span className="py-4 text-[1rem] font-bold text-white">
                    Submit
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="h-[100px] sm:h-[160px]"></div>
        </form>
      </div>
    </div>
  );
}
