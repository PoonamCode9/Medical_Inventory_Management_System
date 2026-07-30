import {
  FaTruck,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const SuppliersDashboardCards = ({ suppliers }) => {
  const totalSuppliers = suppliers.length;

  const uniqueContacts = new Set(
    suppliers.map((s) => s.contactNumber)
  ).size;

  const uniqueEmails = new Set(
    suppliers.map((s) => s.email)
  ).size;

  const uniqueAddresses = new Set(
    suppliers.map((s) => s.address)
  ).size;

  return (
    <div className="dashboard-cards">

      <div className="dashboard-card total">
        <div className="card-icon">🚚</div>
        <h5>Total Suppliers</h5>
        <h2>{totalSuppliers}</h2>
      </div>

      <div className="dashboard-card low">
        <div className="card-icon">
          <FaPhoneAlt />
        </div>
        <h5>Contact Numbers</h5>
        <h2>{uniqueContacts}</h2>
      </div>

      <div className="dashboard-card out">
        <div className="card-icon">
          <FaEnvelope />
        </div>
        <h5>Email IDs</h5>
        <h2>{uniqueEmails}</h2>
      </div>

      <div className="dashboard-card supplier">
        <div className="card-icon">
          <FaMapMarkerAlt />
        </div>
        <h5>Locations</h5>
        <h2>{uniqueAddresses}</h2>
      </div>

    </div>
  );
};

export default SuppliersDashboardCards;