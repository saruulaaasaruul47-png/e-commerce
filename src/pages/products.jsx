import React, { useEffect, useState } from 'react'
import Card from '../components/card/card'
import Title from '../components/title/title'
import Search from '../components/search'
import Menu from '../components/menu'
import { addProductToCart, addProductToWishlist, getProducts } from '../api/api'
import { Link, useNavigate } from 'react-router'
import CartToast from '../components/cart-toast'

const Products = () => {
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState('all')
    const [skinType, setSkinType] = useState('all')
    const [searchInput, setSearchInput] = useState('')
    const [searchText, setSearchText] = useState('')
    const [toast, setToast] = useState(null)
    const navigate = useNavigate()

    const handleAddToCart = async (product) => {
        const result = await addProductToCart(product, 1)
        if (result?.status === 401) {
            navigate('/login')
            return
        }

        setToast((prev) => ({
            id: (prev?.id || 0) + 1,
            message: `Amjilttai sagsallaa: ${product.title}`,
        }))
    }

    const handleAddToWishlist = async (product) => {
        const result = await addProductToWishlist(product)
        if (result?.status === 401) {
            navigate('/login')
            return
        }

        setToast((prev) => ({
            id: (prev?.id || 0) + 1,
            message: result?.already
                ? `Already in wishlist: ${product.title}`
                : `Added to wishlist: ${product.title}`,
        }))
    }

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts()
            setProducts(data)
        }

        fetchProducts()
    }, [])

    const handleSearch = (value) => {
        setSearchText(String(value ?? '').trim().toLowerCase())
    }

    const filteredProducts = products.filter((product) => {
        const categoryMatch = category === 'all' || product.category === category
        const skinTypeMatch = skinType === 'all' || product.skintype === skinType
        const searchMatch = !searchText || [
            product.title,
            product.category,
            product.skintype,
            product.age,
        ]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(searchText))

        return categoryMatch && skinTypeMatch && searchMatch
    })

    return (
        <div className="min-h-screen bg-[#f8fbf6]">
            <CartToast
                key={toast?.id || 0}
                message={toast?.message || ''}
                show={Boolean(toast)}
                onHide={() => setToast(null)}
                duration={3600}
            />

            <div className="mx-auto flex w-full max-w-[1500px] gap-4 px-4 pb-10 md:px-6 lg:gap-6">
                <aside className="hidden w-[240px] shrink-0 lg:block">
                    <Menu
                        onChangeCategory={setCategory}
                        onChangeSkintype={setSkinType}
                        selectedCategory={category}
                        selectedSkintype={skinType}
                    />
                </aside>

                <div className="min-w-0 flex-1">
                    <div className="mb-4 lg:hidden">
                        <Menu
                            compact
                            onChangeCategory={setCategory}
                            onChangeSkintype={setSkinType}
                            selectedCategory={category}
                            selectedSkintype={skinType}
                        />
                    </div>

                    <div className="mb-3 flex flex-col items-start justify-between gap-4 rounded-2xl px-1 py-2 sm:flex-row sm:items-center sm:px-2">
                        <Title genre={'All products'} />
                        <div className="w-full sm:w-auto">
                            <Search
                                value={searchInput}
                                onChange={setSearchInput}
                                onSearch={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#5a7e56]">
                        <span className="rounded-full bg-[#edf4ea] px-3 py-1">Category: {category}</span>
                        <span className="rounded-full bg-[#edf4ea] px-3 py-1">Skin: {skinType}</span>
                        <span className="rounded-full bg-[#edf4ea] px-3 py-1">
                            Search: {searchText || 'all'}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setCategory('all')
                                setSkinType('all')
                                setSearchInput('')
                                setSearchText('')
                            }}
                            className="rounded-full border border-[#c9d8c3] bg-white px-3 py-1 text-[#396539] transition hover:border-[#396539]"
                        >
                            Reset Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <Link key={product.id} to={`/details/${product.id}`} className="flex justify-center">
                                <Card
                                    img={product.img}
                                    title={product.title}
                                    price={product.price}
                                    skintype={product.skintype}
                                    age={product.age}
                                    onOrderNow={() => handleAddToCart(product)}
                                    onAddWishlist={() => handleAddToWishlist(product)}
                                />
                            </Link>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="mt-8 rounded-2xl border border-dashed border-[#c9d8c3] bg-white p-8 text-center text-sm text-[#6b7b62]">
                            No products found. Try changing category/filter/search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Products
