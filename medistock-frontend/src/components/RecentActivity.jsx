function RecentActivity() {

    const activities = [

        {
            title: "Medicine Added",
            message: "Paracetamol was added to inventory.",
            time: "10 mins ago"
        },

        {
            title: "Low Stock Alert",
            message: "Vicks quantity is below 10.",
            time: "30 mins ago"
        },

        {
            title: "Purchase Added",
            message: "Purchase Order #102 created.",
            time: "1 hour ago"
        },

        {
            title: "Supplier Added",
            message: "Apollo Pharma added successfully.",
            time: "Today"
        }

    ];

    return (

        <div className="card shadow">

            <div className="card-body">

                <h4 className="mb-3">
                    Recent Activity
                </h4>

                {activities.map((item, index) => (

                    <div
                        key={index}
                        className="border-bottom pb-2 mb-3"
                    >

                        <h6>{item.title}</h6>

                        <p className="mb-1">
                            {item.message}
                        </p>

                        <small className="text-muted">
                            {item.time}
                        </small>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default RecentActivity;