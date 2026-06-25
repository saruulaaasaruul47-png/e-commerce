import React from "react";

const Card = ({
  img = "",
  title = "Untitled product",
  price = "$0.00",
  skintype = "all skin types",
  age = "N/A",
  onOrderNow,
  onAddWishlist,
}) => {
  const handleOrderNow = (event) => {
    if (!onOrderNow) return;
    event.preventDefault();
    event.stopPropagation();
    onOrderNow();
  };

  const handleAddWishlist = (event) => {
    if (!onAddWishlist) return;
    event.preventDefault();
    event.stopPropagation();
    onAddWishlist();
  };

  return (
    <div className="w-full max-w-[270px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0px_8px_18px_rgba(0,0,0,0.06)]">
      <div className="relative m-2 h-[220px] overflow-hidden rounded-xl sm:h-[240px]">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute right-3 top-3 rounded-md bg-white/90 px-3 py-1 text-sm font-bold text-[#1a2416] shadow">
          {price}
        </div>
      </div>
      <div className="px-4 pb-4">
        <h2 className="mb-2 line-clamp-2 min-h-[46px] text-base font-semibold text-[#1a2416]">
          {title}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <p className="rounded-lg bg-white px-3 py-1 text-[10px] capitalize text-gray-700 shadow-[4px_4px_8px_0px_rgba(0,0,0,0.1)]">
            {skintype}
          </p>
          <p className="rounded-lg bg-white px-3 py-1 text-[10px] text-gray-700 shadow-[4px_4px_8px_0px_rgba(0,0,0,0.1)]">
            {age}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={!onAddWishlist}
            onClick={handleAddWishlist}
            className="text-[10px] text-gray-500 hover:text-[#8b1a2b] disabled:cursor-default disabled:opacity-50"
          >
            Wishlist
          </button>
          <button
            type="button"
            disabled={!onOrderNow}
            onClick={handleOrderNow}
            className="text-[10px] text-gray-500 hover:text-[#285923] disabled:cursor-default disabled:opacity-50"
          >
            Order now -&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
