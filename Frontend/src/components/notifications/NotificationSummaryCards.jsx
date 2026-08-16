import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

import InventoryRoundedIcon
    from "@mui/icons-material/InventoryRounded";

import AccessTimeRoundedIcon
    from "@mui/icons-material/AccessTimeRounded";

import WarningAmberRoundedIcon
    from "@mui/icons-material/WarningAmberRounded";

import CheckCircleRoundedIcon
    from "@mui/icons-material/CheckCircleRounded";


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
            spacing={2.5}
            sx={{ mb: 3 }}
        >

            {cards.map(card => (

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        lg: 3
                    }}
                    key={card.title}
                >

                    <Card
                        elevation={2}
                        sx={{
                            height: "100%",
                            minHeight: 135,
                            borderRadius: 2,

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
                                p: 2.5,

                                "&:last-child": {
                                    pb: 2.5
                                }
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between"
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
                                        fontWeight={700}
                                        sx={{
                                            mt: 0.5,
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {card.value ?? 0}
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 2,

                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",

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
                                    mt: 2,
                                    height: 3,
                                    width: "100%",
                                    borderRadius: 2,
                                    backgroundColor:
                                        `${card.color}20`
                                }}
                            >

                                <Box
                                    sx={{
                                        width: "40%",
                                        height: "100%",
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