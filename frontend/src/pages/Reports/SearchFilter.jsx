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
                    placeholder="Search Reports..."
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
                    className={activeFilter === "Inventory Report" ? "active" : ""}
                    onClick={() => setActiveFilter("Inventory Report")}
                >
                    Inventory
                </button>

                <button
                    className={activeFilter === "Purchase Report" ? "active" : ""}
                    onClick={() => setActiveFilter("Purchase Report")}
                >
                    Purchase
                </button>

                <button
                    className={activeFilter === "Supplier Report" ? "active" : ""}
                    onClick={() => setActiveFilter("Supplier Report")}
                >
                    Supplier
                </button>

                <button
                    className={activeFilter === "Low Stock Report" ? "active" : ""}
                    onClick={() => setActiveFilter("Low Stock Report")}
                >
                    Low Stock
                </button>

            </div>

        </div>

    );

};

export default SearchFilter;