import db from '../../server/db.json'
import { getUser, removeUser, setUser } from './authservice'
const api = 'http://localhost:3001'
const apiProducts = 'http://localhost:3001/products'
const localCartKey = 'cart'
const localWishlistKey = 'wishlist'
const localUsersKey = 'users_local'

const createLocalId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const safeParse = (value, fallback) => {
    try {
        const data = JSON.parse(value)
        return data ?? fallback
    } catch {
        return fallback
    }
}

const getLocalCart = () => {
    if (typeof localStorage === 'undefined') return []
    const rawCart = localStorage.getItem(localCartKey)
    if (!rawCart) return []
    const parsed = safeParse(rawCart, [])
    return Array.isArray(parsed) ? parsed : []
}

const setLocalCart = (items) => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(localCartKey, JSON.stringify(items))
}

const getLocalWishlist = () => {
    if (typeof localStorage === 'undefined') return []
    const rawWishlist = localStorage.getItem(localWishlistKey)
    if (!rawWishlist) return []
    const parsed = safeParse(rawWishlist, [])
    return Array.isArray(parsed) ? parsed : []
}

const setLocalWishlist = (items) => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(localWishlistKey, JSON.stringify(items))
}

const getLocalUsers = () => {
    if (typeof localStorage === 'undefined') return []
    const rawUsers = localStorage.getItem(localUsersKey)
    if (!rawUsers) return []
    const parsed = safeParse(rawUsers, [])
    return Array.isArray(parsed) ? parsed : []
}

const setLocalUsers = (users) => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(localUsersKey, JSON.stringify(users))
}

const findUserByEmail = (users, safeEmail) => {
    const list = Array.isArray(users) ? users : []
    return list.find((el) => String(el?.email ?? '').trim().toLowerCase() === safeEmail)
}

const parseQuantity = (quantity) => {
    const parsed = Number(quantity)
    if (Number.isNaN(parsed) || parsed < 1) return 1
    return Math.floor(parsed)
}

const shapeCartItem = (product, quantity, userID) => {
    const { id: productID, ...rest } = product
    return {
        ...rest,
        productID,
        userID,
        quantity: parseQuantity(quantity)
    }
}

const shapeWishlistItem = (product, userID) => {
    const { id: productID, ...rest } = product
    return {
        ...rest,
        productID,
        userID
    }
}

const isSameProduct = (cartItem, product, userID) => {
    if (cartItem.userID !== userID) return false
    const productId = String(product.id)

    if (cartItem.productID && String(cartItem.productID) === productId) return true
    if (cartItem.productId && String(cartItem.productId) === productId) return true
    if (cartItem.originalProductId && String(cartItem.originalProductId) === productId) return true

    return cartItem.title === product.title &&
        cartItem.category === product.category &&
        cartItem.price === product.price
}

const isSameWishlistProduct = (wishlistItem, product, userID) => {
    if (wishlistItem.userID !== userID) return false
    const productId = String(product.id)

    if (wishlistItem.productID && String(wishlistItem.productID) === productId) return true
    if (wishlistItem.productId && String(wishlistItem.productId) === productId) return true
    if (wishlistItem.originalProductId && String(wishlistItem.originalProductId) === productId) return true

    return wishlistItem.title === product.title &&
        wishlistItem.category === product.category &&
        wishlistItem.price === product.price
}

const deleteCartItemById = async (itemID) => {
    if (!itemID) return
    try {
        await fetch(`${api}/cart/${itemID}`, {
            method: 'DELETE'
        })
    } catch {
        const localCart = getLocalCart()
        const filtered = localCart.filter((item) => item.id !== itemID)
        setLocalCart(filtered)
    }
}

const deleteWishlistItemById = async (itemID) => {
    if (!itemID) return
    try {
        await fetch(`${api}/wishlist/${itemID}`, {
            method: 'DELETE'
        })
    } catch {
        const localWishlist = getLocalWishlist()
        const filtered = localWishlist.filter((item) => item.id !== itemID)
        setLocalWishlist(filtered)
    }
}

export const getProducts = async () => {
    try {
        const res = await fetch(apiProducts)
        const data = await res.json()
        return data
    } catch {
        return db.products
    }
}
export const getProductId = async (id) => {
    try {
        const res = await fetch(`${apiProducts}/${id}`)
        const data = await res.json()
        return data
    } catch {
        return db.products
    }
}
export const getCart = async (id) => {
    try {
        const query = id ? `?userID=${id}` : ''
        const res = await fetch(`${api}/cart${query}`)
        if (!res.ok) throw new Error('Failed to fetch cart')
        const data = await res.json()
        return data
    } catch {
        const localData = getLocalCart()
        if (!id) return localData
        return localData.filter((el => el.userID === id))
    }
}
export const addToCart = async (cartItem) => {
    try {
        let res = await fetch(`${api}/cart/${cartItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartItem)
        })
        if (!res.ok) throw new Error('Failed to update cart')
        let data = await res.json()
        return data
    } catch {
        const localCart = getLocalCart()
        const updated = localCart.map((el) => el.id === cartItem.id ? cartItem : el)
        setLocalCart(updated)
        return cartItem
    }
}

export const updateCartItemQuantity = async (cartItem, quantity) => {
    const nextQuantity = parseQuantity(quantity)
    const updatedItem = { ...cartItem, quantity: nextQuantity }
    const data = await addToCart(updatedItem)
    return data
}

export const removeCartItem = async (itemID) => {
    await deleteCartItemById(itemID)
}

export const saveCart = async (cartItem) => {
    try {
        let res = await fetch(`${api}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartItem)
        })
        if (!res.ok) throw new Error('Failed to save cart')
        let data = await res.json()
        return data
    } catch {
        const localCart = getLocalCart()
        const itemWithId = { ...cartItem, id: createLocalId() }
        const updated = [...localCart, itemWithId]
        setLocalCart(updated)
        return itemWithId
    }
}

export const addProductToCart = async (product, quantity = 1) => {
    const user = getUser()
    if (!user?.id) {
        return { status: 401, error: 'LOGIN_REQUIRED' }
    }

    const safeQuantity = parseQuantity(quantity)
    try {
        const res = await fetch(`${api}/cart?userID=${user.id}`)
        if (!res.ok) throw new Error('Failed to check cart')
        const cartData = await res.json()
        const existingItems = cartData.filter((item) => isSameProduct(item, product, user.id))

        if (existingItems.length > 0) {
            const primary = existingItems[0]
            const existingQty = existingItems.reduce((sum, item) => sum + parseQuantity(item.quantity), 0)
            const updatedItem = {
                ...primary,
                productID: primary.productID || product.id,
                quantity: existingQty + safeQuantity
            }
            const data = await addToCart(updatedItem)
            const duplicated = existingItems.slice(1)
            if (duplicated.length > 0) {
                await Promise.all(duplicated.map((item) => deleteCartItemById(item.id)))
            }
            return { status: 200, data }
        }

        const item = shapeCartItem(product, safeQuantity, user.id)
        const data = await saveCart(item)
        return { status: 200, data }
    } catch {
        const localCart = getLocalCart()
        const existingIndexes = localCart
            .map((item, index) => isSameProduct(item, product, user.id) ? index : -1)
            .filter((index) => index >= 0)

        if (existingIndexes.length > 0) {
            const primaryIndex = existingIndexes[0]
            const existingQty = existingIndexes.reduce((sum, index) => {
                return sum + parseQuantity(localCart[index].quantity)
            }, 0)
            const existing = localCart[primaryIndex]
            const updatedItem = {
                ...existing,
                productID: existing.productID || product.id,
                quantity: existingQty + safeQuantity
            }
            const updated = localCart.filter((_, index) => !existingIndexes.slice(1).includes(index))
            const nextPrimaryIndex = updated.findIndex((item) => item.id === existing.id)
            updated[nextPrimaryIndex] = updatedItem
            setLocalCart(updated)
            return { status: 200, data: updatedItem }
        }

        const newItem = { id: createLocalId(), ...shapeCartItem(product, safeQuantity, user.id) }
        const updated = [...localCart, newItem]
        setLocalCart(updated)
        return { status: 200, data: newItem }
    }
}

export const getWishlist = async (id) => {
    try {
        const query = id ? `?userID=${id}` : ''
        const res = await fetch(`${api}/wishlist${query}`)
        if (!res.ok) throw new Error('Failed to fetch wishlist')
        const data = await res.json()
        return data
    } catch {
        const localData = getLocalWishlist()
        if (!id) return localData
        return localData.filter((item) => item.userID === id)
    }
}

export const removeWishlistItem = async (itemID) => {
    await deleteWishlistItemById(itemID)
}

export const addProductToWishlist = async (product) => {
    const user = getUser()
    if (!user?.id) {
        return { status: 401, error: 'LOGIN_REQUIRED' }
    }

    try {
        const checkRes = await fetch(`${api}/wishlist?userID=${user.id}`)
        if (!checkRes.ok) throw new Error('Failed to check wishlist')
        const wishlistData = await checkRes.json()
        const existing = wishlistData.find((item) => isSameWishlistProduct(item, product, user.id))

        if (existing) {
            return { status: 200, data: existing, already: true }
        }

        const payload = shapeWishlistItem(product, user.id)
        const saveRes = await fetch(`${api}/wishlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        if (!saveRes.ok) throw new Error('Failed to save wishlist')
        const data = await saveRes.json()
        return { status: 200, data, already: false }
    } catch {
        const localWishlist = getLocalWishlist()
        const existing = localWishlist.find((item) => isSameWishlistProduct(item, product, user.id))
        if (existing) {
            return { status: 200, data: existing, already: true }
        }

        const itemWithId = { id: createLocalId(), ...shapeWishlistItem(product, user.id) }
        const updated = [...localWishlist, itemWithId]
        setLocalWishlist(updated)
        return { status: 200, data: itemWithId, already: false }
    }
}

export const clearCartByUser = async (userID) => {
    if (!userID) return
    try {
        const cartItems = await getCart(userID)
        await Promise.all(cartItems.map((item) => deleteCartItemById(item.id)))
    } catch {
        const localCart = getLocalCart()
        const filtered = localCart.filter((item) => item.userID !== userID)
        setLocalCart(filtered)
    }
}

export const getCurrentUser = () => {
    return getUser()
}

export const logoutUser = () => {
    removeUser()
}

export const updateUserProfile = async (userID, profileData) => {
    if (!userID) {
        return { status: 400, error: 'INVALID_USER' }
    }

    try {
        const res = await fetch(`${api}/users/${userID}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        })

        if (!res.ok) {
            throw new Error('Failed to update user')
        }

        const updatedUser = await res.json()
        const current = getUser()
        if (current?.id === updatedUser.id) {
            setUser(updatedUser)
        }
        return { status: 200, data: updatedUser }
    } catch {
        const current = getUser()
        if (!current || current.id !== userID) {
            return { status: 500, error: 'UPDATE_FAILED' }
        }

        const fallbackUser = { ...current, ...profileData }
        setUser(fallbackUser)
        return { status: 200, data: fallbackUser }
    }
}
export const userReq = async (name, email, password) => {
    const safeName = String(name ?? '').trim()
    const safeEmail = String(email ?? '').trim().toLowerCase()
    const safePassword = String(password ?? '')

    if (!safeName || !safeEmail || !safePassword) {
        return { status: 400, error: 'ALL_FIELDS_REQUIRED', message: 'All fields are required.' }
    }

    try {
        const res = await fetch(`${api}/users`)
        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        const user = findUserByEmail(data, safeEmail)
        if (user) {
            return { status: 409, error: 'EMAIL_EXISTS', message: 'Email already exists.' }
        }

        const addUser = await fetch(`${api}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: safeName, email: safeEmail, password: safePassword })
        })
        if (!addUser.ok) throw new Error('Failed to create user')
        const userData = await addUser.json()
        const localUsers = getLocalUsers()
        if (!findUserByEmail(localUsers, safeEmail)) {
            setLocalUsers([...localUsers, userData])
        }
        return { status: 201, message: 'Account created successfully. Please sign in.', user: userData }
    } catch {
        const localUsers = getLocalUsers()
        const user = findUserByEmail(localUsers, safeEmail)
        if (user) {
            return { status: 409, error: 'EMAIL_EXISTS', message: 'Email already exists.' }
        }

        const fallbackUser = {
            id: createLocalId(),
            name: safeName,
            email: safeEmail,
            password: safePassword,
        }
        setLocalUsers([...localUsers, fallbackUser])
        return { status: 201, message: 'Account created successfully. Please sign in.', user: fallbackUser }
    }
}
export const Login = async (email, password) => {
    const safeEmail = String(email ?? '').trim().toLowerCase()
    const safePassword = String(password ?? '')

    if (!safeEmail || !safePassword) {
        return { status: 400, error: 'MISSING_FIELDS', message: 'Email and password are required.' }
    }

    try {
        const res = await fetch(`${api}/users`)
        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        const localUsers = getLocalUsers()
        const users = Array.isArray(data) ? data : []
        const user = findUserByEmail([...users, ...localUsers], safeEmail)
        if (!user) {
            return { status: 401, error: 'EMAIL_NOT_FOUND', message: 'Email not found.' }
        }
        if (String(user.password ?? '') !== safePassword) {
            return { status: 401, error: 'PASSWORD_NOT_MATCH', message: 'Password does not match.' }
        }
        setUser(user)
        return {
            status: 200,
            message: 'Login successful.',
            user: user
        }
    } catch {
        const localUsers = getLocalUsers()
        const user = findUserByEmail(localUsers, safeEmail)
        if (!user) {
            return { status: 401, error: 'EMAIL_NOT_FOUND', message: 'Email not found.' }
        }
        if (String(user.password ?? '') !== safePassword) {
            return { status: 401, error: 'PASSWORD_NOT_MATCH', message: 'Password does not match.' }
        }
        setUser(user)
        return {
            status: 200,
            message: 'Login successful.',
            user: user
        }
    }
}
export const addToWishlist = async (product) => {
    return addProductToWishlist(product)
}
