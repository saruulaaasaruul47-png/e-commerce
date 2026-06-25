import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Pagination } from 'swiper/modules'
import Card from '../card/card'
import cards from './cardlist.module.css'
import { addProductToCart, addProductToWishlist, getProducts } from '../../api/api'
import { useNavigate } from 'react-router'
import CartToast from '../cart-toast'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

export default function CardList() {
  const [products, setProducts] = useState([])
  const [toast, setToast] = useState({ id: 0, message: '', visible: false })
  const navigate = useNavigate()

  const handleOrderNow = async (product) => {
    const result = await addProductToCart(product, 1)
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

  const handleAddWishlist = async (product) => {
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts()
      setProducts(data.slice(0, 9))
    }
    fetchData()
  }, [])

  return (
    <div className={cards.cardlist}>
      <CartToast
        key={toast.id}
        message={toast.message}
        show={toast.visible}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
        duration={3600}
      />

      <Swiper
        slidesPerView={1.15}
        spaceBetween={10}
        freeMode={true}
        breakpoints={{
          480: { slidesPerView: 1.5, spaceBetween: 10 },
          640: { slidesPerView: 2.1, spaceBetween: 12 },
          768: { slidesPerView: 2.8, spaceBetween: 12 },
          1024: { slidesPerView: 4, spaceBetween: 14 },
          1280: { slidesPerView: 5, spaceBetween: 16 },
        }}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className={cards.mySwiper}
      >
        {products.map((item) => (
          <SwiperSlide key={item.id}>
            <Card
              img={item.img}
              title={item.title}
              price={item.price}
              skintype={item.skintype}
              age={item.age}
              onOrderNow={() => handleOrderNow(item)}
              onAddWishlist={() => handleAddWishlist(item)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
