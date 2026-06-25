import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import CartToast from '../components/cart-toast'
import {
    addProductToCart,
    getCurrentUser,
    getWishlist,
    removeWishlistItem
} from '../api/api'
import { AUTH_CHANGE_EVENT } from '../api/authservice'

const Wishlist = () => {
    const [user, setUser] = useState(() => getCurrentUser())
    const [wishlistItems, setWishlistItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [busyItemId, setBusyItemId] = useState('')
    const [toast, setToast] = useState({ id: 0, message: '', visible: false })
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
        const fetchWishlist = async () => {
            if (!user?.id) {
                setWishlistItems([])
                setLoading(false)
                return
            }

            setLoading(true)
            const data = await getWishlist(user.id)
            setWishlistItems(data)
            setLoading(false)
        }

        fetchWishlist()
    }, [user?.id])

    const handleRemove = async (itemID) => {
        const previousItems = wishlistItems
        setWishlistItems((current) => current.filter((item) => item.id !== itemID))

        try {
            setBusyItemId(itemID)
            await removeWishlistItem(itemID)
        } catch {
            setWishlistItems(previousItems)
        } finally {
            setBusyItemId('')
        }
    }

    const handleAddToCart = async (item) => {
        const productPayload = {
            ...item,
            id: item.productID || item.productId || item.id,
        }

        setBusyItemId(item.id)
        const result = await addProductToCart(productPayload, 1)
        if (result?.status === 401) {
            setBusyItemId('')
            navigate('/login')
            return
        }

        setBusyItemId('')
        setToast((prev) => ({
            id: (prev?.id || 0) + 1,
            message: `Added to cart: ${item.title}`,
            visible: true,
        }))
    }

    const showLoginBlock = !user
    const showLoading = user && loading
    const showEmptyState = user && !loading && wishlistItems.length === 0
    const showWishlist = user && !loading && wishlistItems.length > 0

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f6faf3]">
            <CartToast
                key={toast.id}
                message={toast.message}
                show={toast.visible}
                onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
                duration={3600}
            />

            <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:px-8">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold text-[#1a2416]">My Wishlist</h1>
                    <span className="rounded-full bg-[#eaf3de] px-3 py-1 text-xs font-medium text-[#3b6d11]">
                        {wishlistItems.length} items
                    </span>
                </div>

                {showLoginBlock && (
                    <div className="rounded-2xl border border-[#d8e2d2] bg-white p-6 text-[#395923] shadow-sm">
                        <p className="mb-3 text-sm">Please login to see your wishlist.</p>
                        <Link to="/login" className="inline-flex rounded-xl bg-[#285923] px-4 py-2 text-sm text-white">
                            Go to Login
                        </Link>
                    </div>
                )}

                {showLoading && (
                    <div className="rounded-2xl border border-[#d8e2d2] bg-white p-6 text-sm text-[#6b7b62] shadow-sm">
                        Loading wishlist...
                    </div>
                )}

                {showEmptyState && (
                    <div className="rounded-2xl border border-dashed border-[#c9d5bf] bg-white p-10 text-center text-sm text-[#6b7b62] shadow-sm">
                        Your wishlist is empty.
                    </div>
                )}

                {showWishlist && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {wishlistItems.map((item) => {
                            const isBusy = busyItemId === item.id
                            return (
                                <div key={item.id} className="rounded-2xl border border-[#d8e2d2] bg-white p-4 shadow-sm">
                                    <Link to={`/details/${item.productID || item.id}`} className="block">
                                        <div className="mb-3 h-[220px] w-full overflow-hidden rounded-xl border border-[#e3eadf] bg-[#f2f7ee]">
                                            <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                                        </div>
                                        <h2 className="line-clamp-2 text-sm font-medium text-[#1a2416]">{item.title}</h2>
                                    </Link>

                                    <div className="mt-2 flex items-center justify-between gap-2">
                                        <span className="text-sm font-semibold text-[#1a2416]">{item.price}</span>
                                        <span className="rounded-md bg-[#edf4ea] px-2 py-1 text-[11px] text-[#5e6b55]">
                                            {item.skintype}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            type="button"
                                            disabled={isBusy}
                                            onClick={() => handleAddToCart(item)}
                                            className="flex-1 rounded-xl bg-[#285923] px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isBusy}
                                            onClick={() => handleRemove(item.id)}
                                            className="rounded-xl border border-[#d8e2d2] px-3 py-2 text-xs text-[#6b7b62] transition hover:text-[#8b1a2b] disabled:opacity-50"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wishlist
