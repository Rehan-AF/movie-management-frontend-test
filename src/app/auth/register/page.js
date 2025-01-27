'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { setToken, setUserInfo } from '@/redux/userSlice/userSlice'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { FaQuestionCircle } from 'react-icons/fa'
const Page = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL
    const data = { username, email, password }

    try {
      const response = await axios.post(`${apiUrl}/auth/signup`, data, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status === 201) {
        const { token, user } = response.data
        console.log(token, user, 'reponse code success')

        dispatch(setToken(token))
        dispatch(setUserInfo(user))
        router.push('/movies')
      } else {
        console.log(response, 'response in else')

        setError(response)
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err?.response?.data?.message || 'Registration failed. Please try again.')
      } else {
        setError(err.message.re)
      }
      console.error('Error during registration:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#093545]">
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

      <div className="z-10 w-full max-w-[350px] space-y-8 px-4">
        <div className="text-center">
          <h1 className="font mb-8 text-[4rem] font-semibold leading-[5rem] text-white">Sign up</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              class="flex w-full items-center justify-between rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 opacity-75"
              role="alert"
            >
              <div>
                <strong class="font-bold">Error:</strong>&nbsp;
                <span class="block sm:inline">{error}</span>
              </div>
              <span class="py-3" type="button" onClick={() => setError(false)}>
                <svg
                  class="h-6 w-6 fill-current text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </span>
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 w-full rounded-[0.6rem] border-0 bg-[#224957] px-4 py-[0.6rem] text-white placeholder-white outline-none lg:h-[3rem]"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-[0.6rem] border-0 bg-[#224957] px-4 py-[0.6rem] text-white placeholder-white outline-none lg:h-[3rem]"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-[0.6rem] border-0 bg-[#224957] px-4 py-[0.6rem] text-white placeholder-white outline-none lg:h-[3rem]"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 w-full rounded-[0.6rem] border-0 bg-[#224957] px-4 py-[0.6rem] text-white placeholder-white outline-none lg:h-[3rem]"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="peer hidden"
            />
            <label
              htmlFor="agreeTerms"
              className={`h-5 w-5 rounded-md ${
                agreeTerms ? 'bg-[#2BD17E]' : 'bg-[#224957]'
              } peer-checked:border-[#224957] peer-checked:bg-[#2BD17E]`}
            />
            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-white">
              I agree to the Terms and Conditions
            </label>
          </div>

          {/* Already have an account? */}
          <div className="flex items-center justify-center space-x-1">
            <FaQuestionCircle className="h-4 w-4 text-[#2BD17E]" />
            <Link
              href="/auth/login"
              className="cursor-pointer text-sm text-[#2BD17E] hover:underline"
            >
              Already have an account?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading} 
            className={`h-12 w-full rounded-[0.6rem] bg-[#2BD17E] transition-colors duration-200 hover:bg-emerald-600 lg:h-[3.5rem] ${
              loading ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            {loading ? (
              <svg
                className="mx-auto h-5 w-5 animate-spin text-white"
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
              <span className="py-4 text-[1rem] font-bold text-white">Sign up</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Page
