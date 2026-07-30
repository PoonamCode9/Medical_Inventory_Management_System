import { FaSearch } from "react-icons/fa";

const SupplierSearch = ({ search, searchSupplier }) => {
    return (
        <div className="search-filter-box">
            <div className="search-box">
                <FaSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search supplier, email or contact..."
                    value={search}
                    onChange={(e) => searchSupplier(e.target.value)}
                />
            </div>
        </div>
    );
};

export default SupplierSearch;