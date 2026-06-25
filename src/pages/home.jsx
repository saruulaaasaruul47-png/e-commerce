import React from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import { useEffect, useState } from 'react'
import HeaderMenu from '../components/header/header'
import Hero from '../components/hero/hero'
import CardList from '../components/cardlist/cardlist'
import CertificateSection from '../components/certificate'
import Title from '../components/title/title'

const Home = () => {
    const [data, setData] = useState()
    const apiUrl = import.meta.env.VITE_API_URL
    useEffect(() => {
        const testFetch = async () => {
            let data = await axios.get(`${apiUrl}`)
            setData(data.data.message)
            return data
        }
        testFetch()
    },[])

    return (
        <div className="home overflow-x-hidden bg-[#f9fcf7]">
            <HeaderMenu />
            <div className="h-16 w-full bg-white lg:h-[76px]"></div>
            <p>{data}</p>
            <Hero />

            <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-10 sm:px-6 lg:gap-10 lg:px-10 lg:py-14">
                <Title genre={'Best sellers'} />
                <CardList />
                <Link
                    to="/products"
                    className="mt-1 inline-flex w-fit rounded-[10px] bg-[#396539] px-5 py-2.5 font-abhayaExtrabold text-white transition hover:opacity-90"
                >
                    View All Products
                </Link>
            </section>

            <CertificateSection />
        </div>
    )
}

export default Home
