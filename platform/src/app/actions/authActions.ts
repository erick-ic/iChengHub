'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface LoginState {
  error: string;
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
    redirect('/ibackend')
  }

  return { error: 'Invalid Access Code' }
}

export async function logout() {
  cookies().delete('admin_session')
  redirect('/')
}
