import { FaSearch } from "react-icons/fa";

const SearchFilter = ({
    search,
    setSearch,
    activeFilter,
    setActiveFilter
}) => {

    return (

        <div className="search-filter-box">

            <div className="search-box">

                <FaSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search Medicine..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <div className="filter-section">

                <span className="filter-title">

                    Filters

                </span>

                <button
                    className={activeFilter === "ALL" ? "active" : ""}
                    onClick={() => setActiveFilter("ALL")}
                >
                    All
                </button>

                <button
                    className={activeFilter === "IN_STOCK" ? "active" : ""}
                    onClick={() => setActiveFilter("IN_STOCK")}
                >
                    In Stock
                </button>

                <button
                    className={activeFilter === "LOW_STOCK" ? "active" : ""}
                    onClick={() => setActiveFilter("LOW_STOCK")}
                >
                    Low Stock
                </button>

                <button
                    className={activeFilter === "OUT_OF_STOCK" ? "active" : ""}
                    onClick={() => setActiveFilter("OUT_OF_STOCK")}
                >
                    Out Of Stock
                </button>

            </div>

        </div>

    );

};

export default SearchFilter;