'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface LoginState {
  success: boolean;
  error?: string;
}

const getEnvValue = (value: string | undefined): string => {
  if (!value) return ''
  return value.replace(/^["']|["']$/g, '')
}

export async function login(state: LoginState, formData: FormData): Promise<LoginState> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const AUTH_USER = getEnvValue(process.env.ADMIN_USERNAME)
  const AUTH_PASS = getEnvValue(process.env.ADMIN_PASSWORD)

  if (username === AUTH_USER && password === AUTH_PASS) {
    cookies().set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
    return { success: true }
  }

  return { success: false, error: '凭据错误' }
}

export async function logout(): Promise<{ success: boolean }> {
  cookies().delete('admin_session')
  return { success: true }
}