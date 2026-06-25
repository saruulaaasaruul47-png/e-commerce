import React from 'react'
import { Outlet } from 'react-router'
import HeaderMenu from '../components/header/header'

const ShopLayout = () => {
    return (
        <div>
            <HeaderMenu />
            <div className="h-16 w-full bg-white lg:h-[76px]"></div>
            <Outlet />
        </div>
    )
}

export default ShopLayout