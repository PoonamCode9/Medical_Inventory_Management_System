import { FaSearch } from "react-icons/fa";

const SearchFilter = ({
search,
setSearch,
activeFilter,
setActiveFilter
})=>{

return(

<div className="search-filter-box">

<div className="search-box">

<FaSearch className="search-icon"/>

<input

type="text"

placeholder="Search Users..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>

</div>

<div className="filter-section">

<span className="filter-title">

Filters

</span>

<button

className={activeFilter==="ALL"?"active":""}

onClick={()=>setActiveFilter("ALL")}

>

All

</button>

<button

className={activeFilter==="ADMIN"?"active":""}

onClick={()=>setActiveFilter("ADMIN")}

>

Admin

</button>

<button

className={activeFilter==="PHARMACIST"?"active":""}

onClick={()=>setActiveFilter("PHARMACIST")}

>

Pharmacist

</button>

<button

className={activeFilter==="STAFF"?"active":""}

onClick={()=>setActiveFilter("STAFF")}

>

Staff

</button>

</div>

</div>

);

};

export default SearchFilter;