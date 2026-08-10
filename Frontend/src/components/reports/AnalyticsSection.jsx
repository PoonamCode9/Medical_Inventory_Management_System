import {
    Card,
    CardContent,
    Divider,
    Grid,
    Typography
} from "@mui/material";

function formatLabel(label) {

    return label

        .replace(/([A-Z])/g, " $1")

        .replace(/^./, (str) => str.toUpperCase());

}

function AnalyticsSection({

    title,

    analytics

}) {

    if (!analytics) {

        return null;

    }

    return (

        <Card
            elevation={3}
            sx={{
                mb: 4,
                borderRadius: 3
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >

                    {title}

                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={3}
                >

                    {

                        Object.entries(analytics).map(

                            ([key, value]) => (

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={key}
                                >

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >

                                        {formatLabel(key)}

                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                    >

                                        {value}

                                    </Typography>

                                </Grid>

                            )

                        )

                    }

                </Grid>

            </CardContent>

        </Card>

    );

}

export default AnalyticsSection;