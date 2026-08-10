import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box
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
            icon: <InventoryRoundedIcon />
        },

        {
            title: "Expiring Soon",
            value: summary.expiringSoon,
            color: "#ED6C02",
            icon: <AccessTimeRoundedIcon />
        },

        {
            title: "Expired",
            value: summary.expired,
            color: "#D32F2F",
            icon: <WarningAmberRoundedIcon />
        },

        {
            title: "Resolved",
            value: summary.resolved,
            color: "#2E7D32",
            icon: <CheckCircleRoundedIcon />
        }

    ];

    return (

        <Grid
            container
            spacing={3}
            sx={{
                mb: 3
            }}
        >

            {cards.map((card) => (

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
                            height: 170,
                            borderRadius: 3,

                            display: "flex",

                            transition:
                                "transform 0.2s ease, box-shadow 0.2s ease",

                            "&:hover": {
                                transform:
                                    "translateY(-3px)",
                                boxShadow: 6
                            }
                        }}
                    >

                        <CardContent
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                p: 3,

                                "&:last-child": {
                                    pb: 3
                                }
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "flex-start"
                                }}
                            >

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        fontWeight={500}
                                    >
                                        {card.title}
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                        sx={{
                                            mt: 0.5,
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {card.value}
                                    </Typography>

                                </Box>

                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,

                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        color: card.color,

                                        backgroundColor:
                                            `${card.color}15`
                                    }}
                                >

                                    {card.icon}

                                </Box>

                            </Box>

                            <Box
                                sx={{
                                    height: 4,
                                    width: "100%",
                                    borderRadius: 2,
                                    backgroundColor:
                                        `${card.color}25`
                                }}
                            >

                                <Box
                                    sx={{
                                        height: "100%",
                                        width: "40%",
                                        borderRadius: 2,
                                        backgroundColor:
                                            card.color
                                    }}
                                />

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

}

export default NotificationSummaryCards;