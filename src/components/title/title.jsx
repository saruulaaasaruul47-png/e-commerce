import React from 'react'

const Title = ({ genre }) => {
    return (
        <div className="mb-2">
            <h3 className="font-sansitaOne text-[28px] leading-tight text-[#396539] sm:text-[32px] lg:text-[36px]">
                {genre}
            </h3>
        </div>
    )
}

export default Title
