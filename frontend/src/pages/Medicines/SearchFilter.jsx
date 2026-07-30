import { FaSearch } from "react-icons/fa";

const SearchFilter = ({
    search,
    searchMedicine,
    activeFilter,
    setActiveFilter
}) => {

    return (

        <div className="search-filter-box">

            <div className="search-box">

                <FaSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search medicine, batch or category..."
                    value={search}
                    onChange={(e) =>
                        searchMedicine(e.target.value)
                    }
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
                    className={activeFilter === "INSTOCK" ? "active" : ""}
                    onClick={() => setActiveFilter("INSTOCK")}
                >
                    In Stock
                </button>

                <button
                    className={activeFilter === "LOW" ? "active" : ""}
                    onClick={() => setActiveFilter("LOW")}
                >
                    Low Stock
                </button>

                <button
                    className={activeFilter === "OUT" ? "active" : ""}
                    onClick={() => setActiveFilter("OUT")}
                >
                    Out of Stock
                </button>

            </div>

        </div>

    );

};

export default SearchFilter;