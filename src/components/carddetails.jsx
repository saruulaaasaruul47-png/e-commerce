import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { addProductToCart, addProductToWishlist } from '../api/api'
import CartToast from './cart-toast'

const CardDetails = ({ product }) => {
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState({ id: 0, message: '', visible: false })
  const navigate = useNavigate()

  const hasah = () => {
    if (qty > 1) setQty(qty - 1)
  }

  const nemeh = () => setQty(qty + 1)

  const handleAddToCart = async () => {
    const result = await addProductToCart(product, qty)
    if (result?.status === 401) {
      navigate('/login')
      return
    }

    setToast((prev) => ({
      id: (prev?.id || 0) + 1,
      message: `Amjilttai sagsallaa: ${product.title}`,
      visible: true,
    }))
  }

  const handleAddToWishlist = async () => {
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
      visible: true,
    }))
  }

  if (!product) return null

  return (
    <div className="flex min-h-screen justify-center bg-[#E1E7DE]/30 px-4 py-8 sm:px-6 md:py-12">
      <CartToast
        key={toast.id}
        message={toast.message}
        show={toast.visible}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
        duration={3600}
      />

      <div className="w-full max-w-6xl rounded-3xl bg-white p-5 shadow-xl sm:p-8 lg:p-10">
        <div className="grid gap-7 md:grid-cols-2 md:gap-10 lg:gap-12">
          <div className="flex flex-col gap-4">
            <img
              src={product.img}
              alt={product.title}
              className="h-[280px] w-full rounded-2xl object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>

          <div className="flex flex-col gap-6 text-[#285923]">
            <div>
              <h1 className="mb-2 text-3xl font-abhayaExtrabold leading-tight sm:text-4xl">{product.title}</h1>
              <p className="text-[#6B9267]/85 opacity-70">
                Perfect for daily gentle cleansing and hydration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-2xl font-bold sm:text-3xl">{product.price}</span>
              <span className="bg-[#6B9267]/11 text-sm px-3 py-1 rounded-[10px]">
                {product.skintype}
              </span>
            </div>

            <p className="text-sm leading-relaxed opacity-80 text-[#395923]/58">
              A refreshing cleanser that removes impurities without stripping your
              skin. Designed with soothing botanical extracts for a calm and
              balanced complexion.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-sm">Quantity:</span>
              <div className="flex items-center border border-[#285923] rounded-xl overflow-hidden">
                <button onClick={hasah} className="px-2 py-1">-</button>
                <span className="px-4 py-1">{qty}</span>
                <button onClick={nemeh} className="px-2 py-1">+</button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#285923] text-white py-3 rounded-xl hover:opacity-90 transition"
              >
                Add to Cart ({qty})
              </button>
              <button onClick={handleAddToWishlist} className="flex items-center justify-center rounded-xl border border-[#396539] px-4 py-3  transition sm:py-0">
                <i className="pi pi-heart text-lg hover:text-[#396539]"></i>
              </button>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-3 text-center sm:grid-cols-3 sm:gap-4 sm:mt-4">
              <div className="bg-[#6B9267]/11 p-4 rounded-xl text-[#396539] text-sm">Natural</div>
              <div className="bg-[#6B9267]/11 p-4 rounded-xl text-[#396539] text-sm">Daily Use</div>
              <div className="bg-[#6B9267]/11 p-4 rounded-xl text-[#396539] text-sm">Hydrating</div>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-4 text-[#4a5c3f] sm:gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
          <div className="rounded-2xl bg-[#f4f7f3] p-6 sm:p-7">
            <h2 className="mb-3 text-[22px] font-semibold text-[#285923] sm:text-[24px]">Ingredients</h2>
            <p className="text-[14px] opacity-80 text-[#395923]/58 leading-relaxed">
              Aloe Vera, Hyaluronic Acid, Green Tea Extract, Vitamin E, Chamomile Extract.
            </p>
          </div>
          <div className="rounded-2xl bg-[#f4f7f3] p-6 sm:p-7">
            <h2 className="mb-3 text-[22px] font-semibold text-[#285923] sm:text-[24px]">Benefits</h2>
            <p className="text-[14px] opacity-80 leading-relaxed text-[#395923]/58">
              Cleanses deeply, hydrates the skin, reduces irritation and improves texture.
            </p>
          </div>
          <div className="rounded-2xl bg-[#f4f7f3] p-6 sm:p-7">
            <h2 className="mb-3 text-[22px] font-semibold text-[#285923] sm:text-[24px]">How to Use</h2>
            <p className="text-[14px] opacity-80 leading-relaxed text-[#395923]/58">
              Use morning and evening. Apply to wet skin, massage gently, rinse thoroughly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardDetails
