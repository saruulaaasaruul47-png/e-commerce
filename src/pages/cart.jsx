import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import 'primeicons/primeicons.css'
import CartCount from '../components/cartcount'
import CartSummary from '../components/cart-summary'
import CartToast from '../components/cart-toast'
import {
    addProductToWishlist,
    clearCartByUser,
    getCart,
    getCurrentUser,
    removeCartItem,
    updateCartItemQuantity
} from '../api/api'
import { AUTH_CHANGE_EVENT } from '../api/authservice'

const parsePrice = (price) => {
    const value = Number.parseFloat(String(price ?? '').replace(/[^0-9.]/g, ''))
    return Number.isNaN(value) ? 0 : value
}

const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`
}

const getItemQty = (item) => {
    const qty = Number(item.quantity)
    if (Number.isNaN(qty) || qty < 1) return 1
    return Math.floor(qty)
}

const getItemStock = (item) => {
    const stock = Number(item.stock)
    if (Number.isNaN(stock) || stock < 1) return 99
    return Math.floor(stock)
}

const Cart = () => {
    const [user, setUser] = useState(() => getCurrentUser())
    const [cartItems, setCartItems] = useState([])
    const [savedItems, setSavedItems] = useState({})
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
        const fetchCartItems = async () => {
            if (!user?.id) {
                setCartItems([])
                setLoading(false)
                return
            }

            setLoading(true)
            const data = await getCart(user.id)
            setCartItems(data)
            setLoading(false)
        }

        fetchCartItems()
    }, [user?.id])

    const handleQtyChange = async (item, step) => {
        const currentQty = getItemQty(item)
        const nextQty = Math.max(1, Math.min(getItemStock(item), currentQty + step))
        if (nextQty === currentQty) return

        const previousItems = cartItems
        setCartItems((current) =>
            current.map((currentItem) =>
                currentItem.id === item.id
                    ? { ...currentItem, quantity: nextQty }
                    : currentItem
            )
        )

        try {
            setBusyItemId(item.id)
            await updateCartItemQuantity(item, nextQty)
        } catch {
            setCartItems(previousItems)
        } finally {
            setBusyItemId('')
        }
    }

    const handleRemoveItem = async (itemID) => {
        const previousItems = cartItems
        setCartItems((current) => current.filter((item) => item.id !== itemID))

        try {
            setBusyItemId(itemID)
            await removeCartItem(itemID)
        } catch {
            setCartItems(previousItems)
        } finally {
            setBusyItemId('')
        }
    }

    const handleClearCart = async () => {
        if (!user?.id || cartItems.length === 0) return

        const previousItems = cartItems
        setCartItems([])

        try {
            await clearCartByUser(user.id)
        } catch {
            setCartItems(previousItems)
        }
    }

    const handleSaveToWishlist = async (item) => {
        const productPayload = {
            ...item,
            id: item.productID || item.productId || item.id
        }

        setBusyItemId(item.id)
        const result = await addProductToWishlist(productPayload)

        if (result?.status === 401) {
            setBusyItemId('')
            navigate('/login')
            return
        }

        setSavedItems((prev) => ({
            ...prev,
            [item.id]: true
        }))
        setBusyItemId('')
        setToast((prev) => ({
            id: (prev?.id || 0) + 1,
            message: result?.already
                ? `Already in wishlist: ${item.title}`
                : `Added to wishlist: ${item.title}`,
            visible: true
        }))
    }

    const showLoginBlock = !user
    const showLoading = user && loading
    const showEmptyState = user && !loading && cartItems.length === 0
    const showCartList = user && !loading && cartItems.length > 0

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
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <section className="min-w-0">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                            <h1 className="text-2xl font-semibold text-[#1a2416]">My Cart</h1>
                            <button
                                onClick={handleClearCart}
                                disabled={!user || cartItems.length === 0}
                                className="inline-flex shrink-0 items-center gap-2 text-sm text-[#6b7b62] hover:text-[#395923] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <i className="pi pi-trash text-xs"></i>
                                Clear Cart
                            </button>
                        </div>

                        {showLoginBlock && (
                            <div className="rounded-2xl border border-[#d8e2d2] bg-white p-6 text-[#395923] shadow-sm">
                                <p className="mb-3 text-sm">Please login to see your cart.</p>
                                <Link to="/login" className="inline-flex rounded-xl bg-[#285923] px-4 py-2 text-sm text-white">
                                    Go to Login
                                </Link>
                            </div>
                        )}

                        {showLoading && (
                            <div className="rounded-2xl border border-[#d8e2d2] bg-white p-6 text-sm text-[#6b7b62] shadow-sm">
                                Loading cart...
                            </div>
                        )}

                        {showEmptyState && (
                            <div className="rounded-2xl border border-dashed border-[#c9d5bf] bg-white p-10 text-center text-sm text-[#6b7b62] shadow-sm">
                                Your cart is empty.
                            </div>
                        )}

                        {showCartList && (
                            <div className="space-y-4">
                                {cartItems.map((item) => {
                                    const itemQty = getItemQty(item)
                                    const lineTotal = parsePrice(item.price) * itemQty
                                    const maxStock = getItemStock(item)
                                    const isBusy = busyItemId === item.id

                                    return (
                                        <div key={item.id} className="rounded-2xl border border-[#d8e2d2] bg-white p-4 shadow-sm sm:p-5">
                                            <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 sm:grid-cols-[84px_minmax(0,1fr)] sm:gap-4">
                                                <div className="h-[72px] w-[72px] overflow-hidden rounded-xl border border-[#e3eadf] bg-[#f2f7ee] sm:h-[84px] sm:w-[84px]">
                                                    <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[11px] text-[#8a9780]">SKU: {item.productID || item.id}</p>
                                                    <h2 className="mt-1 break-words text-sm font-medium leading-5 text-[#1a2416]">{item.title}</h2>

                                                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <span className="text-sm font-medium text-[#58684d]">{item.price}</span>

                                                        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
                                                            <CartCount
                                                                quantity={itemQty}
                                                                maxStock={maxStock}
                                                                isBusy={isBusy}
                                                                onDecrease={() => handleQtyChange(item, -1)}
                                                                onIncrease={() => handleQtyChange(item, 1)}
                                                            />
                                                            <span className="whitespace-nowrap text-sm font-semibold text-[#1a2416]">{formatAmount(lineTotal)}</span>
                                                        </div>
                                                    </div>

                                                    <span className="mt-2 inline-flex rounded-md bg-[#eaf3de] px-2 py-1 text-[11px] font-medium text-[#3b6d11]">
                                                        Stock: {maxStock}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#e7eee2] pt-3">
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleSaveToWishlist(item)}
                                                    className={`inline-flex items-center gap-1 text-xs ${savedItems[item.id] ? 'text-[#8b1a2b]' : 'text-[#6b7b62]'} hover:text-[#8b1a2b]`}
                                                >
                                                    <i className={`pi ${savedItems[item.id] ? 'pi-heart-fill' : 'pi-heart'}`}></i>
                                                    Save
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="inline-flex items-center gap-1 text-xs text-[#6b7b62] hover:text-[#8b1a2b] disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <i className="pi pi-times"></i>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        )}
                    </section>
                    <CartSummary items={cartItems} />
                </div>
            </div>
        </div>
    )
}

export default Cart
