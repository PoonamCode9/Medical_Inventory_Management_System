import {
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

function NotificationSummaryCards({
    summary
}) {

    const cards = [

        {
            title: "Low Stock",
            value: summary.lowStock,
            color: "#1976D2",
            icon: <InventoryRoundedIcon fontSize="large" />
        },

        {
            title: "Expiring Soon",
            value: summary.expiringSoon,
            color: "#ED6C02",
            icon: <AccessTimeRoundedIcon fontSize="large" />
        },

        {
            title: "Expired",
            value: summary.expired,
            color: "#D32F2F",
            icon: <WarningAmberRoundedIcon fontSize="large" />
        },

        {
            title: "Resolved",
            value: summary.resolved,
            color: "#2E7D32",
            icon: <CheckCircleRoundedIcon fontSize="large" />
        }

    ];

    return (

        <Grid
            container
            spacing={3}
            sx={{ mb: 3 }}
        >

            {

                cards.map((card) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={card.title}
                    >

                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                                height: "100%"
                            }}
                        >

                            <CardContent>

                                <Typography
                                    color="text.secondary"
                                    gutterBottom
                                >

                                    {card.title}

                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                >

                                    {card.value}

                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 2,
                                        color: card.color
                                    }}
                                >

                                    {card.icon}

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                ))

            }

        </Grid>

    );

}

export default NotificationSummaryCards;