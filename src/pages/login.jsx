import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import HeaderMenu from '../components/header/header'
import { Login } from '../api/api'

const Log_in = () => {
    const location = useLocation()
    const [email, setEmail] = useState(location?.state?.email || '')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState({
        type: location?.state?.fromSignup ? 'success' : '',
        text: location?.state?.message || '',
    })
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault()
        if (submitting) return

        setSubmitting(true)
        setStatus({ type: '', text: '' })

        const user = await Login(email, password)
        if (user?.status === 200) {
            setStatus({ type: 'success', text: user.message })
            navigate('/account', { replace: true })
        } else {
            setStatus({
                type: 'error',
                text: user?.message || 'Could not login. Please try again.',
            })
        }
        setSubmitting(false)
    }

    return (
        <div className="bg-[#e8f0e2]">
            <HeaderMenu />
            <div className="h-16 w-full bg-white lg:h-[76px]"></div>

            <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-6 lg:min-h-[calc(100vh-76px)]">
                <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-lg sm:p-8 lg:p-10">
                    <h1 className="mb-2 text-2xl font-serif text-green-900 sm:text-3xl">Sign In</h1>
                    <p className="mb-6 text-sm text-green-700 sm:mb-8 sm:text-base">
                        Start your personalized skincare journey
                    </p>

                    <form onSubmit={handleLogin}>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            className="mb-4 w-full rounded-xl border border-green-600 px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="nuuts ugee hii"
                            className="mb-4 w-full rounded-xl border border-green-600 px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-[#4a5c3f] py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                        >
                            {submitting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-green-700">
                        Don't have an account?{' '}
                        <Link to="/signin" className="cursor-pointer underline">
                            Create Account
                        </Link>
                    </p>

                    {status.text && (
                        <p className={`mt-4 text-sm ${status.type === 'error' ? 'text-[#8b1a2b]' : 'text-[#3f5f39]'}`}>
                            {status.text}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Log_in
