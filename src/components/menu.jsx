import React from 'react'

const CATEGORY_OPTIONS = [
    { value: 'all', label: 'All Products' },
    { value: 'cleanser', label: 'Cleanser' },
    { value: 'toner', label: 'Toner' },
    { value: 'serum', label: 'Serum' },
    { value: 'cream', label: 'Cream' },
    { value: 'mask', label: 'Mask' },
    { value: 'sunscreen', label: 'Sunscreen' },
    { value: 'other', label: 'Others' },
]

const SKIN_OPTIONS = [
    { value: 'all', label: 'All Skin Types' },
    { value: 'oily-skin', label: 'Oily skin' },
    { value: 'dry-skin', label: 'Dry skin' },
    { value: 'combination-skin', label: 'Combination skin' },
    { value: 'sensitive-skin', label: 'Sensitive skin' },
]

const Menu = ({
    onChangeCategory,
    onChangeSkintype,
    selectedCategory = 'all',
    selectedSkintype = 'all',
    compact = false,
}) => {
    const groupClass = compact ? 'flex flex-wrap gap-[20px]' : 'flex flex-col items-start gap-[10px]'
    const btnClass = compact
        ? 'rounded-full border border-[#c9d8c3] bg-white px-3 py-1 text-[12px] font-medium text-[#5a7e56] transition hover:border-[#396539] hover:text-[#396539]'
        : 'text-[12px] font-medium text-[#6B9267]/85 transition hover:translate-x-1 hover:text-[#396539]'
    const activeClass = compact
        ? 'border-[#396539] text-[#396539]'
        : 'text-[#285923] font-semibold'

    return (
        <div className={`w-full rounded-xl bg-[#E1E7DE]/40 p-4 shadow-[0px_0px_10px_#00000022] sm:p-5 ${compact ? '' : 'lg:sticky lg:top-24'}`}>
            <p className="mb-2 text-[18px] font-abrilFatface text-[#285923]">Categories</p>
            <div className={groupClass}>
                {CATEGORY_OPTIONS.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChangeCategory(item.value)}
                        className={`${btnClass} ${selectedCategory === item.value ? activeClass : ''}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <p className="mb-2 mt-4 text-[18px] font-abrilFatface text-[#285923]">Skin type</p>
            <div className={groupClass}>
                {SKIN_OPTIONS.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChangeSkintype(item.value)}
                        className={`${btnClass} ${selectedSkintype === item.value ? activeClass : ''}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Menu
