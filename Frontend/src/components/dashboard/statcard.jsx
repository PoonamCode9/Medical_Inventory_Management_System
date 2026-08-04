import { Card, CardContent, Typography, Box } from "@mui/material";

function StatCard({ title, value, icon, color }) {

    return (

        <Card
            elevation={2}
            sx={{
                borderRadius: 3,
                height: "100%",
                transition: "0.2s",
                "&:hover": {
                    transform: "translateY(-4px)",
                }
            }}
        >

            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box>

                        <Typography
                            color="text.secondary"
                            fontSize={14}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            mt={1}
                        >
                            {value}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            backgroundColor: `${color}15`,
                            color: color,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
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