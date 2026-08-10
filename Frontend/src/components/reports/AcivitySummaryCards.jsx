import {
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

function ActivitySummaryCards({ activities }) {

    const totalActivities = activities.length;

    const today = new Date().toDateString();

    const todayActivities = activities.filter(activity =>

        new Date(activity.performedAt).toDateString() === today

    ).length;

    const moduleCounts = {};

    const userCounts = {};

    activities.forEach(activity => {

        moduleCounts[activity.module] =
            (moduleCounts[activity.module] || 0) + 1;

        userCounts[activity.performedBy] =
            (userCounts[activity.performedBy] || 0) + 1;

    });

    const mostActiveModule =

        Object.keys(moduleCounts).length > 0

            ? Object.keys(moduleCounts).reduce(

                (a, b) =>

                    moduleCounts[a] > moduleCounts[b]

                        ? a

                        : b

            )

            : "N/A";

    const mostActiveUser =

        Object.keys(userCounts).length > 0

            ? Object.keys(userCounts).reduce(

                (a, b) =>

                    userCounts[a] > userCounts[b]

                        ? a

                        : b

            )

            : "N/A";

    const cards = [

        {

            title: "Total Activities",

            value: totalActivities

        },

        {

            title: "Today's Activities",

            value: todayActivities

        },

        {

            title: "Most Active Module",

            value: mostActiveModule

        },

        {

            title: "Most Active User",

            value: mostActiveUser

        }

    ];

    return (

        <Grid
            container
            spacing={3}
        >

            {

                cards.map(card => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={card.title}
                    >

                        <Card
                            sx={{

                                borderRadius: 3,

                                boxShadow: 2

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

                                    variant="h5"

                                    fontWeight="bold"

                                >

                                    {card.value}

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                ))

            }

        </Grid>

    );

}

export default ActivitySummaryCards;