import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getCurrentUser, logoutUser } from '../../api/api'
import { AUTH_CHANGE_EVENT } from '../../api/authservice'

const HeaderMenu = () => {
    const [user, setUser] = useState(getCurrentUser())
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const syncUser = () => {
            setUser(getCurrentUser())
        }

        window.addEventListener('storage', syncUser)
        window.addEventListener('focus', syncUser)
        window.addEventListener(AUTH_CHANGE_EVENT, syncUser)
        return () => {
            window.removeEventListener('storage', syncUser)
            window.removeEventListener('focus', syncUser)
            window.removeEventListener(AUTH_CHANGE_EVENT, syncUser)
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const links = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/orders', label: 'Orders' },
        { to: '/wishlist', label: 'Wishlist' },
        { to: user ? '/account' : '/login', label: user ? 'My Account' : 'Login' },
    ]

    const userLabel = user?.name?.trim()?.split(' ')[0] || user?.email || ''

    const handleLogout = () => {
        logoutUser()
        setUser(null)
        setMobileOpen(false)
        navigate('/login')
    }

    return (
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#dce6d8] bg-white/95 shadow-[0px_4px_14px_rgba(20,70,39,0.12)] backdrop-blur">
            <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:h-[76px] lg:px-10">
                <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="font-shrikhand text-[30px] leading-none text-[#396539] [text-shadow:0px_2px_5px_rgba(0,0,0,0.2)] sm:text-[34px]"
                >
                    G<span className="text-[#1a1a14]">low</span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    {links.map((item) => (
                        <Link
                            key={item.to}
                            className="text-[14px] font-medium text-[#1a1a14] transition hover:text-[#396539]"
                            to={item.to}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {user && (
                        <>
                            <span className="rounded-full bg-[#eaf3de] px-3 py-1 text-xs font-medium text-[#3b6d11]">
                                Signed in: {userLabel}
                            </span>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-[13px] font-medium text-[#8b1a2b] transition hover:opacity-80"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </nav>

                <button
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#cfdbc8] text-[#2a4a21] transition hover:bg-[#f4f8f2] md:hidden"
                >
                    {mobileOpen ? 'Close' : 'Menu'}
                </button>
            </div>

            <div
                className={`overflow-hidden border-t border-[#e4ede0] bg-white px-4 transition-all duration-300 md:hidden ${mobileOpen ? 'max-h-80 pb-4 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
            >
                <nav className="flex flex-col gap-2 pt-3">
                    {links.map((item) => (
                        <Link
                            key={`mobile-${item.to}`}
                            className="rounded-lg px-3 py-2 text-[14px] font-medium text-[#1a1a14] transition hover:bg-[#f4f8f2] hover:text-[#396539]"
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {user && (
                        <>
                            <div className="rounded-lg bg-[#edf5e8] px-3 py-2 text-[12px] text-[#3b6d11]">
                                Signed in: {userLabel}
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-lg px-3 py-2 text-left text-[14px] font-medium text-[#8b1a2b] transition hover:bg-[#f9eeee]"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default HeaderMenu
