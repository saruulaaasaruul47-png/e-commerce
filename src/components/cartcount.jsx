import React from 'react'

const CartCount = ({ quantity, maxStock, isBusy, onDecrease, onIncrease }) => {
    return (
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#cfdac7]">
                <button
                    type="button"
                    disabled={isBusy}
                    onClick={onDecrease}
                    className="h-7 w-7 bg-[#f5f8f3] text-base text-[#1a2416] disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
                >
                    -
                </button>
                <span className="inline-flex h-7 min-w-8 items-center justify-center border-x border-[#dbe5d5] px-2 text-sm font-medium text-[#1a2416] sm:h-8 sm:min-w-9">
                    {quantity}
                </span>
                <button
                    type="button"
                    disabled={isBusy || quantity >= maxStock}
                    onClick={onIncrease}
                    className="h-7 w-7 bg-[#f5f8f3] text-base text-[#1a2416] disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
                >
                    +
                </button>
            </div>
        </div>
    )
}

export default CartCount
