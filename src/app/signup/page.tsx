// src/app/signup/page.tsx
'use client'
 
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
 
export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
 
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
 
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
 
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
 
    router.push('/dashboard')
  }
 
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSignUp} className="w-full max-w-md space-y-4 p-8">
        <h1 className="text-2xl font-bold">Create Account</h1>
 
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
 
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
 
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
          minLength={6}
          required
        />
 
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
 
        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}