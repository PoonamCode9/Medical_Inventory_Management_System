import "../Medicines/Medicines.css";
import {
    FaShoppingCart,
    FaClock,
    FaCheckCircle,
    FaTruck
} from "react-icons/fa";

const PurchaseCards = ({ purchaseOrders }) => {

    const totalOrders = purchaseOrders.length;

    const pendingOrders = purchaseOrders.filter(
        order => order.status === "Pending"
    ).length;

    const completedOrders = purchaseOrders.filter(
        order => order.status === "Completed"
    ).length;

    const suppliers = new Set(
        purchaseOrders.map(order => order.supplier?.supplierName)
    ).size;

    return (

        <div className="dashboard-cards">

            <div className="dashboard-card total">
                <div className="card-icon">🛒</div>
                <h5>Total Orders</h5>
                <h2>{totalOrders}</h2>
            </div>

            <div className="dashboard-card low">
                <div className="card-icon">⏳</div>
                <h5>Pending</h5>
                <h2>{pendingOrders}</h2>
            </div>

            <div className="dashboard-card supplier">
                <div className="card-icon">✅</div>
                <h5>Completed</h5>
                <h2>{completedOrders}</h2>
            </div>

            <div className="dashboard-card out">
                <div className="card-icon">🚚</div>
                <h5>Suppliers</h5>
                <h2>{suppliers}</h2>
            </div>

        </div>

    );
};

export default PurchaseCards;