import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import "../Medicines/Medicines.css";

import {
    FaEdit,
    FaBoxes
} from "react-icons/fa";

import DashboardCards from "./DashboardCards";
import SearchFilter from "./SearchFilter";

import {
    getInventory,
    updateInventory
} from "../../services/stockService";

const Stock = () => {

    const token = localStorage.getItem("token");

    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    const [showModal, setShowModal] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const [formData, setFormData] = useState({
        quantityAvailable: 0,
        minimumStock: 0
    });

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 6;

    const fetchInventory = async () => {

        try {

            const response = await getInventory(token);

            setInventory(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await fetchInventory();

            setLoading(false);

        };

        loadData();

    }, []);

    useEffect(() => {

        let temp = [...inventory];

        // Search

        if (search !== "") {

            temp = temp.filter(item =>

                item.medicineName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

            );

        }

        // Filters

        if (activeFilter === "IN_STOCK") {

            temp = temp.filter(

                item =>
                    item.quantityAvailable >
                    item.minimumStock

            );

        }

        if (activeFilter === "LOW_STOCK") {

            temp = temp.filter(

                item =>
                    item.quantityAvailable > 0 &&
                    item.quantityAvailable <=
                    item.minimumStock

            );

        }

        if (activeFilter === "OUT_OF_STOCK") {

            temp = temp.filter(

                item =>
                    item.quantityAvailable === 0

            );

        }

        setFilteredInventory(temp);

    }, [inventory, search, activeFilter]);

    const indexOfLast = currentPage * itemsPerPage;

    const indexOfFirst = indexOfLast - itemsPerPage;

    const currentInventory = filteredInventory.slice(

        indexOfFirst,

        indexOfLast

    );

    const totalPages = Math.ceil(

        filteredInventory.length / itemsPerPage

    );

    const openUpdateModal = (item) => {

        setSelectedItem(item);

        setFormData({

            quantityAvailable: item.quantityAvailable,

            minimumStock: item.minimumStock

        });

        setShowModal(true);

    };

    const handleUpdate = async () => {

        try {

            await updateInventory(

                selectedItem.inventoryId,

                formData,

                token

            );

            Swal.fire({

                icon: "success",

                title: "Updated!",

                text: "Stock updated successfully.",

                confirmButtonColor: "#14968d"

            });

            setShowModal(false);

            fetchInventory();

        } catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Oops",

                text: "Failed to update stock."

            });

        }

    };

    if (loading) {

        return (

            <div className="loading-container">

                <div className="spinner-border text-success"></div>

                <h4>Loading Inventory...</h4>

            </div>

        );

    }

    return (

<div className="medicine-page">

    {/* Header */}

    <div className="medicine-header">

        <div>

            <h1>📦 Stock Dashboard</h1>

            <p>Manage Medicine Inventory</p>

        </div>

    </div>

    {/* Dashboard Cards */}

    <DashboardCards inventory={inventory} />

    {/* Search */}

    <SearchFilter

        search={search}
        setSearch={setSearch}

        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}

    />

    {/* Inventory Table */}

    <div className="card shadow border-0 rounded-4">

        <div className="card-body p-0">

            <table className="table table-hover align-middle mb-0">

                <thead
                    style={{
                        background:"#14968d",
                        color:"white"
                    }}
                >

                    <tr>

                        <th>Medicine</th>

 

                        <th>Available</th>

                        <th>Minimum</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                {

                    currentInventory.length > 0 ?

                    currentInventory.map(item => (

                        <tr key={item.inventoryId}>

                            <td>

                                <div className="medicine-info">

                                    <div className="medicine-icon">

                                        <FaBoxes/>

                                    </div>

                                    <div>

                                        <h6>

                                            {item.medicineName}

                                        </h6>

                                    </div>

                                </div>

                            </td>

                            <td>

                                {item.quantityAvailable}

                            </td>

                            <td>

                                {item.minimumStock}

                            </td>

                            <td>

                                {

                                    item.quantityAvailable===0 ?

                                    <span className="status-badge out">

                                        Out Of Stock

                                    </span>

                                    :

                                    item.quantityAvailable<=item.minimumStock ?

                                    <span className="status-badge low">

                                        Low Stock

                                    </span>

                                    :

                                    <span className="status-badge instock">

                                        In Stock

                                    </span>

                                }

                            </td>

                            <td>

                                <button

                                    className="btn btn-info btn-sm"

                                    onClick={()=>openUpdateModal(item)}

                                >

                                    <FaEdit/>

                                </button>

                            </td>

                        </tr>

                    ))

                    :

                    <tr>

                        <td
                            colSpan="6"
                            className="text-center p-5"
                        >

                            No Medicines Found

                        </td>

                    </tr>

                }

                </tbody>

            </table>

            {/* Pagination */}

            <div className="pagination-container">

                <button

                    disabled={currentPage===1}

                    onClick={()=>setCurrentPage(currentPage-1)}

                >

                    Previous

                </button>

                {

                    [...Array(totalPages)].map((_,index)=>(

                        <button

                            key={index}

                            className={
                                currentPage===index+1
                                ?
                                "active-page"
                                :
                                ""
                            }

                            onClick={()=>setCurrentPage(index+1)}

                        >

                            {index+1}

                        </button>

                    ))

                }

                <button

                    disabled={
                        currentPage===totalPages
                        ||
                        totalPages===0
                    }

                    onClick={()=>setCurrentPage(currentPage+1)}

                >

                    Next

                </button>

            </div>

        </div>

    </div>

    {/* Update Modal */}

    {

        showModal && (

        <div className="modal-overlay">

            <div className="medicine-modal">

                <h3>

                    Update Stock

                </h3>

                <label>

                    Available Quantity

                </label>

                <input

                    type="number"

                    className="supplier-select"

                    value={formData.quantityAvailable}

                    onChange={(e)=>

                        setFormData({

                            ...formData,

                            quantityAvailable:Number(e.target.value)

                        })

                    }

                />

                <label className="mt-3">

                    Minimum Stock

                </label>

                <input

                    type="number"

                    className="supplier-select"

                    value={formData.minimumStock}

                    onChange={(e)=>

                        setFormData({

                            ...formData,

                            minimumStock:Number(e.target.value)

                        })

                    }

                />

                <div className="d-flex justify-content-end gap-2 mt-4">

                    <button

                        className="modal-cancel-btn"

                        onClick={()=>setShowModal(false)}

                    >

                        Cancel

                    </button>

                    <button

                        className="modal-save-btn"

                        onClick={handleUpdate}

                    >

                        Save

                    </button>

                </div>

            </div>

        </div>

        )

    }

</div>

);

};

export default Stock;