import "../Medicines/Medicines.css";

import { FaSearch } from "react-icons/fa";

const PurchaseSearch = ({
    search,
    searchPurchase,
    activeFilter,
    setActiveFilter
}) => {

    return (

        <div className="search-filter-box">

            <div className="search-box">

                <FaSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search medicine, supplier or status..."
                    value={search}
                    onChange={(e) => searchPurchase(e.target.value)}
                />

            </div>

            <div className="filter-section">

                <span className="filter-title">
                    Status
                </span>

                <button
                    className={activeFilter === "ALL" ? "active" : ""}
                    onClick={() => setActiveFilter("ALL")}
                >
                    All
                </button>

                <button
                    className={activeFilter === "Pending" ? "active" : ""}
                    onClick={() => setActiveFilter("Pending")}
                >
                    Pending
                </button>

                <button
                    className={activeFilter === "Completed" ? "active" : ""}
                    onClick={() => setActiveFilter("Completed")}
                >
                    Completed
                </button>

                <button
                    className={activeFilter === "Cancelled" ? "active" : ""}
                    onClick={() => setActiveFilter("Cancelled")}
                >
                    Cancelled
                </button>

            </div>

        </div>

    );

};

export default PurchaseSearch;