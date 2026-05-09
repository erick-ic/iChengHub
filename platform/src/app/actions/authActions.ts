'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface LoginState {
  success: boolean;
  error?: string;
}

export async function login(state: LoginState, formData: FormData): Promise<LoginState> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const password = formData.get('password') as string

  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
    return { success: true }
  }

  return { success: false, error: 'Invalid Access Code' }
}

export async function logout(): Promise<{ success: boolean }> {
  cookies().delete('admin_session')
  return { success: true }
}