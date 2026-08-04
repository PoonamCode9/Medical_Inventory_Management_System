import { Card, CardContent, Typography, Box } from "@mui/material";

function DashboardCard({ title, value, icon, color = "#1976D2" }) {

    return (

        <Card
            sx={{
                borderRadius: 3,
                boxShadow: 2,
                height: "100%"
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
                            variant="body2"
                            color="text.secondary"
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
                            backgroundColor: color,
                            color: "white",
                            p: 2,
                            borderRadius: 2
                        }}
                    >
                        {icon}
                    </Box>

                </Box>

            </CardContent>
        </Card>

    );

}

export default DashboardCard;