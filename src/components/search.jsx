import React from "react";
import 'primeicons/primeicons.css';

const Search = ({
    value = '',
    onChange = () => {},
    onSearch = () => {},
    placeholder = 'Search by name, category...',
}) => {
    const handleSubmit = (event) => {
        event.preventDefault()
        onSearch(value)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="search-box flex h-[42px] w-full max-w-[420px] items-center rounded-3xl border border-[#045739] bg-[#f8fbf6]"
        >
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent px-4 py-2 text-sm text-[#000000] outline-none sm:text-base"
            />

            <button
                type="submit"
                aria-label="Search products"
                className="h-full rounded-r-3xl px-3 text-[#045739] transition hover:bg-[#e8f1e3]"
            >
                <span
                    className="pi pi-search"
                    style={{ color: '#045739', fontWeight: '800', fontSize: '16px' }}
                ></span>
            </button>
        </form>
    )
}

export default Search;
