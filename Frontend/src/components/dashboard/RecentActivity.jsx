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

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

function RecentActivity({
    title = "Dashboard Updates",
    activities = []
}) {

    return (

        <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>

            <CardContent>

                <Typography variant="h6" fontWeight="bold" mb={2}>
                    {title}
                </Typography>

                <List>

                    {activities.length === 0 && (

                        <ListItem>

                            <ListItemText
                                primary="No updates available."
                                primaryTypographyProps={{
                                    color: "text.secondary"
                                }}
                            />

                        </ListItem>

                    )}

                    {activities.map((activity, index) => (

                        <div key={index}>

                            <ListItem>

                                <ListItemIcon>
                                    <HistoryRoundedIcon color="primary" />
                                </ListItemIcon>

                                <ListItemText primary={activity} />

                            </ListItem>

                            {index !== activities.length - 1 && <Divider />}

                        </div>

                    ))}

                </List>

            </CardContent>

        </Card>

    );

}

export default RecentActivity;
