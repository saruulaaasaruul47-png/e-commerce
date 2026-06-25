import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import HeaderMenu from '../components/header/header'
import { userReq } from '../api/api'

const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [status, setStatus] = useState({ type: '', text: '' })
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleCreateAccount = async (event) => {
        event.preventDefault()
        if (submitting) return

        if (password !== confirmPassword) {
            setStatus({ type: 'error', text: 'Passwords do not match.' })
            return
        }

        setSubmitting(true)
        setStatus({ type: '', text: '' })

        const fullName = [name, lastName].join(' ').trim()
        const result = await userReq(fullName, email, password)
        if (result?.status === 201) {
            navigate('/login', {
                state: {
                    fromSignup: true,
                    email: String(email ?? '').trim().toLowerCase(),
                    message: result.message || 'Account created successfully. Please sign in.',
                },
            })
        } else {
            setStatus({
                type: 'error',
                text: result?.message || 'Could not create account. Please try again.',
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
                    <h1 className="mb-2 text-2xl font-serif text-green-900 sm:text-3xl">Create Account</h1>
                    <p className="mb-6 text-sm text-green-700 sm:mb-8 sm:text-base">
                        Start your personalized skincare journey
                    </p>

                    <form onSubmit={handleCreateAccount}>
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="First Name"
                                className="w-full rounded-xl border border-green-600 px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                            />
                            <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                type="text"
                                placeholder="Last Name"
                                className="w-full rounded-xl border border-green-600 px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

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

                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            placeholder="dahiad hii"
                            className="mb-6 w-full rounded-xl border border-green-600 px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-[#4a5c3f] py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                        >
                            {submitting ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-green-700">
                        Already have an account?{' '}
                        <Link to="/login" className="cursor-pointer underline">
                            Sign in
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

export default Signin
