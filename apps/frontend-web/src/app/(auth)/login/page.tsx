'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await apiClient.post('/auth/login', { email, password });

      if (response.status === true) {
        // Support both { status: true, data: { accessToken... } } and { status: true, accessToken... }
        const dataPayload = response.data || response;
        const { accessToken, refreshToken, user } = dataPayload;

        if (accessToken) {
          Cookies.set('access_token', accessToken, { expires: 1 }); // 1 day
          if (refreshToken) {
            Cookies.set('refresh_token', refreshToken, { expires: 7 }); // 7 days
          }
          if (user) {
            Cookies.set('user_info', JSON.stringify(user), { expires: 1 });
          }
          
          console.log('Login success');
          router.push('/');
        } else {
          setError('Không tìm thấy token trong phản hồi.');
        }
      } else {
        setError(response.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra.';
      setError(typeof errorMsg === 'string' ? errorMsg : errorMsg[0] || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-900 p-8 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign in to CINEPROX
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Access your premium CINEPROX membership.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm flex flex-col gap-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border-0 bg-gray-800 py-3 px-4 text-white placeholder-gray-400 ring-1 ring-inset ring-gray-700 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-md border-0 bg-gray-800 py-3 px-4 text-white placeholder-gray-400 ring-1 ring-inset ring-gray-700 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-red-600 px-3 py-3 text-sm font-semibold text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
