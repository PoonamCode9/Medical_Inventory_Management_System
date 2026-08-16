import {
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";

import HistoryRoundedIcon
    from "@mui/icons-material/HistoryRounded";


function RecentActivity({
    title = "Dashboard Updates",
    activities = []
}) {

    return (

        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
                borderColor: "divider"
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

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 1
                    }}
                >
                    {title}
                </Typography>


                <Divider
                    sx={{
                        mb: 1
                    }}
                />


                <List
                    disablePadding
                >

                    {!activities.length && (

                        <ListItem
                            sx={{
                                px: 0,
                                py: 2
                            }}
                        >

                            <ListItemIcon
                                sx={{
                                    minWidth: 40
                                }}
                            >

                                <HistoryRoundedIcon
                                    color="disabled"
                                />

                            </ListItemIcon>

                            <ListItemText
                                primary="No updates available."
                                primaryTypographyProps={{
                                    color:
                                        "text.secondary",
                                    fontSize:
                                        "0.9rem"
                                }}
                            />

                        </ListItem>

                    )}


                    {activities.map(
                        (activity, index) => (

                            <div
                                key={index}
                            >

                                <ListItem
                                    sx={{
                                        px: 0,
                                        py: 1.25
                                    }}
                                >

                                    <ListItemIcon
                                        sx={{
                                            minWidth: 40
                                        }}
                                    >

                                        <HistoryRoundedIcon
                                            color="primary"
                                            fontSize="small"
                                        />

                                    </ListItemIcon>


                                    <ListItemText
                                        primary={activity}
                                        primaryTypographyProps={{
                                            fontSize:
                                                "0.9rem",
                                            color:
                                                "text.primary"
                                        }}
                                    />

                                </ListItem>


                                {index <
                                    activities.length - 1 && (
                                    <Divider />
                                )}

                            </div>

                        )
                    )}

                </List>

            </CardContent>

        </Card>

    );

}


export default RecentActivity;