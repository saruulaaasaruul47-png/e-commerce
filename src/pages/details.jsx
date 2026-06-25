import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import HeaderMenu from '../components/header/header'
import CardDetails from '../components/carddetails'
import { getProductId } from '../api/api'
const Details = () => {
    const { id } = useParams();
    const [product, setProduct] = useState();
    useEffect(()=>{
        const fetchData = async () => {
            const data = await getProductId(id)
            setProduct(data)
        }
        fetchData()
    }, [id])
    return (
        <div className="bg-[#f8fbf6]">
            <HeaderMenu />
            <div className="h-16 w-full bg-white lg:h-[76px]"></div>
            {
                product &&
                <CardDetails product={product} />
            }
        </div>
    )
}

export default Details
