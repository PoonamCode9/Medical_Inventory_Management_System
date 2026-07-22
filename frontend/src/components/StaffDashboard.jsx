export default function StaffDashboard({ user, onLogout }) {
  return (
    <div className="dashboard-full">

            <button type="button" className="btn-danger" onClick={onLogout}>
        🚪 Log Out
      </button>
    </div>
  );
}
