import KpiCard from '../admin/components/KpiCard.jsx'
import SupplierLayout from './SupplierLayout.jsx'
import SupplierPurchaseOrders from './SupplierPurchaseOrders.jsx'

export default function SupplierDashboardHome() {
  return (
    
    // <SupplierLayout>
      
    //   <div className="bb-main-content">
    //     <section className="bb-kpi-row" aria-label="Key performance indicators">
    //       <KpiCard title="Total Requests" value="0" trend="0%" icon="cart" spark={[0, 0, 0, 0, 0, 0, 0]} />
    //       <KpiCard title="Accepted Requests" value="0" trend="0%" icon="value" spark={[0, 0, 0, 0, 0, 0, 0]} />
    //       <KpiCard title="Rejected Requests" value="0" trend="0%" icon="out" spark={[0, 0, 0, 0, 0, 0, 0]} trendTone="down" />
    //     </section>
    //   </div>
      
    // </SupplierLayout>

    <SupplierPurchaseOrders>
      </SupplierPurchaseOrders>
    
  )
}

