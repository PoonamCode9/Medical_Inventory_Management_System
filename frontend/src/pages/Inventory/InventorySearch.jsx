import { FaSearch } from "react-icons/fa";

const InventorySearch = ({
  search,
  searchInventory,
  activeFilter,
  setActiveFilter
}) => {

  return (
    <div className="search-filter-box">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => searchInventory(e.target.value)}
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

      </div>

    </div>
  );
};

export default InventorySearch;