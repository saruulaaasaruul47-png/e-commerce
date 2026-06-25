import React from 'react'

const parsePrice = (price) => {
    const value = Number.parseFloat(String(price ?? '').replace(/[^0-9.]/g, ''))
    return Number.isNaN(value) ? 0 : value
}

const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`
}

const normalizeQty = (value) => {
    const qty = Number(value)
    if (Number.isNaN(qty) || qty < 1) return 1
    return Math.floor(qty)
}

const CartSummary = ({ items }) => {
    const subtotal = items.reduce((sum, item) => {
        return sum + parsePrice(item.price) * normalizeQty(item.quantity)
    }, 0)

    const totalCount = items.reduce((sum, item) => {
        return sum + normalizeQty(item.quantity)
    }, 0)

    return (
        <div className="h-fit w-full rounded-2xl border border-[#d8e2d2] bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-4 text-lg font-medium text-[#1a2416]">Order Summary</h2>

            {items.length > 0 && (
                <div className="mb-4 max-h-[280px] space-y-3 overflow-y-auto border-b border-[#e7eee2] pb-4 pr-1">
                    {items.map((item) => (
                        <div key={`summary-${item.id}`} className="flex items-center gap-2">
                            <div className="h-10 w-10 overflow-hidden rounded-md border border-[#e3eadf] bg-[#f2f7ee]">
                                <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs text-[#55624b]">{item.title}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] text-[#8a9780]">x{normalizeQty(item.quantity)}</p>
                                <p className="text-xs font-medium text-[#1a2416]">
                                    {formatAmount(parsePrice(item.price) * normalizeQty(item.quantity))}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-[#6b7b62]">Items</span>
                    <span className="font-medium text-[#1a2416]">{totalCount}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[#6b7b62]">Subtotal</span>
                    <span className="font-medium text-[#1a2416]">{formatAmount(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[#6b7b62]">Shipping</span>
                    <span className="text-[#8a9780]">Calculated later</span>
                </div>
            </div>

            <div className="my-4 h-px bg-[#e7eee2]"></div>

            <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1a2416]">Total</span>
                <span className="text-lg font-semibold text-[#1a2416]">{formatAmount(subtotal)}</span>
            </div>

            <button
                type="button"
                disabled={items.length === 0}
                className="w-full rounded-xl bg-[#285923] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#d3dccd] disabled:text-[#6b7b62]"
            >
                Continue Checkout
            </button>
        </div>
    )
}

export default CartSummary
