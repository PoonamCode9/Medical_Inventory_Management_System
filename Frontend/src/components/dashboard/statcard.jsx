import {
    Box,
    Card,
    CardContent,
    Typography
} from "@mui/material";


function StatCard({
    title,
    value,
    icon,
    color
}) {

    return (

        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
                borderColor: "divider",
                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                    transform:
                        "translateY(-3px)",
                    boxShadow:
                        "0 8px 24px rgba(15, 23, 42, 0.09)"
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
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        gap: 2
                    }}
                >

                    <Box
                        sx={{
                            minWidth: 0
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontWeight: 600,
                                mb: 0.75,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}
                        >
                            {title}
                        </Typography>


                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.2,
                                color: "text.primary"
                            }}
                        >
                            {value}
                        </Typography>

                    </Box>


                    <Box
                        sx={{
                            flexShrink: 0,
                            width: 52,
                            height: 52,
                            borderRadius: 2.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                                `${color}15`,
                            color
                        }}
                    >
                        {icon}
                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

}


export default StatCard;