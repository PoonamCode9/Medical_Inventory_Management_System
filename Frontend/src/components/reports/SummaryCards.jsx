import {
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

import InventoryRoundedIcon
    from "@mui/icons-material/InventoryRounded";

import LocalPharmacyRoundedIcon
    from "@mui/icons-material/LocalPharmacyRounded";

import BusinessRoundedIcon
    from "@mui/icons-material/BusinessRounded";

import ShoppingCartRoundedIcon
    from "@mui/icons-material/ShoppingCartRounded";

import NotificationsRoundedIcon
    from "@mui/icons-material/NotificationsRounded";

import PeopleRoundedIcon
    from "@mui/icons-material/PeopleRounded";


function SummaryCards({
    summary,
    inventory,
    purchaseOrders,
    notifications,
    users
}) {

    const cards = [

        {
            title: "Total Medicines",
            value: summary?.totalMedicines || 0,
            subtitle: "Medicines in system",
            icon: LocalPharmacyRoundedIcon,
            color: "#1976D2"
        },

        {
            title: "Inventory Batches",
            value:
                summary?.totalInventoryBatches || 0,
            subtitle:
                `${inventory?.lowStock || 0} low stock`,
            icon: InventoryRoundedIcon,
            color: "#2E7D32"
        },

        {
            title: "Suppliers",
            value:
                summary?.totalSuppliers || 0,
            subtitle:
                `${inventory ? summary?.totalSuppliers || 0 : 0} active`,
            icon: BusinessRoundedIcon,
            color: "#0288D1"
        },

        {
            title: "Purchase Orders",
            value:
                summary?.totalPurchaseOrders || 0,
            subtitle:
                `${purchaseOrders?.pendingOrders || 0} pending`,
            icon: ShoppingCartRoundedIcon,
            color: "#ED6C02"
        },

        {
            title: "Notifications",
            value:
                summary?.totalNotifications || 0,
            subtitle:
                `${notifications?.activeNotifications || 0} active`,
            icon: NotificationsRoundedIcon,
            color: "#D32F2F"
        },

        {
            title: "Users",
            value:
                summary?.totalUsers || 0,
            subtitle:
                `${users?.adminUsers || 0} admin`,
            icon: PeopleRoundedIcon,
            color: "#7B1FA2"
        }

    ];


    return (

        <Grid
            container
            spacing={3}
            sx={{
                mb: 4
            }}
        >

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={4}
                        key={card.title}
                    >

                        <Card
                            elevation={2}
                            sx={{
                                height: "100%",
                                minHeight: 165,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease",

                                "&:hover": {
                                    transform:
                                        "translateY(-3px)",
                                    boxShadow: 5
                                }
                            }}
                        >

                            <CardContent
                                sx={{
                                    height: "100%",
                                    p: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2.5,

                                    "&:last-child": {
                                        pb: 3
                                    }
                                }}
                            >

                                {/* Icon */}

                                <Grid
                                    sx={{
                                        width: 58,
                                        height: 58,
                                        minWidth: 58,
                                        borderRadius: 2.5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor:
                                            `${card.color}15`,
                                        color: card.color
                                    }}
                                >

                                    <Icon
                                        sx={{
                                            fontSize: 30
                                        }}
                                    />

                                </Grid>


                                {/* Card Information */}

                                <Grid
                                    sx={{
                                        minWidth: 0,
                                        flex: 1
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        fontWeight={600}
                                        noWrap
                                    >

                                        {card.title}

                                    </Typography>


                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        sx={{
                                            lineHeight: 1.2,
                                            my: 0.75
                                        }}
                                    >

                                        {card.value}

                                    </Typography>


                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        noWrap
                                    >

                                        {card.subtitle}

                                    </Typography>

                                </Grid>

                            </CardContent>

                        </Card>

                    </Grid>

                );

            })}

        </Grid>

    );

}

export default SummaryCards;