import React from 'react'
import { Link } from 'react-router'

const Hero = () => {
    return (
        <section className="min-h-[72vh] bg-[#fbfff9]">
            <div className="mx-auto grid min-h-[72vh] max-w-[1400px] grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_minmax(300px,44%)] md:py-10 lg:px-10">
                <div className="order-2 flex flex-col justify-center gap-5 md:order-1 md:pr-6">
                    <h3 className="font-cabin text-[34px] leading-[1.1] font-medium text-[#1a2416] sm:text-[44px] lg:text-[58px]">
                        Luxury Skincare,
                        <br />
                        <span className="font-shrikhand text-[#396539]">Effortlessly</span> Yours
                    </h3>

                    <p className="max-w-[560px] text-[14px] leading-6 text-[#080909]/75 font-abhayaMedium sm:text-[15px]">
                        Advanced formulations exquisitely ingredients, and effortless beauty - discover skincare redefined.
                    </p>

                    <Link
                        to="/products"
                        className="inline-flex w-fit rounded-[10px] bg-[#396539] px-5 py-2.5 font-abhayaExtrabold text-white transition hover:opacity-90"
                    >
                        Shop now
                    </Link>
                </div>

                <div className="order-1 overflow-hidden rounded-3xl shadow-[0px_20px_40px_rgba(19,57,19,0.18)] md:order-2">
                    <img
                        className="h-[320px] w-full object-cover sm:h-[360px] md:h-[520px]"
                        src="https://i.pinimg.com/736x/74/3e/7e/743e7e91713fd66db2f223afe5c2255e.jpg"
                        alt="Skincare products"
                    />
                </div>
            </div>
        </section>
    )
}

export default Hero
