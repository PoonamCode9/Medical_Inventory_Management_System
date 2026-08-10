import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Typography
} from "@mui/material";

import activityService from "../../services/activityService";

import ActivitySummaryCards from "../../components/reports/ActivitySummaryCards";
import ActivityToolbar from "../../components/reports/ActivityToolbar";
import ActivityTable from "../../components/reports/ActivityTable";
import ActivityDetailsDialog from "../../components/reports/ActivityDetailsDialog";

function SystemActivity() {

    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedActivity, setSelectedActivity] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);

    const [search, setSearch] = useState("");

    const [moduleFilter, setModuleFilter] = useState("");

    const [actionFilter, setActionFilter] = useState("");

    const [roleFilter, setRoleFilter] = useState("");

    useEffect(() => {

        loadActivities();

    }, []);

    const loadActivities = async () => {

        try {

            setLoading(true);

            const data =
                await activityService.getAllActivities();

            setActivities(data);

        }

        catch (error) {

            console.error(error);

            setError(
                "Failed to load activity logs."
            );

        }

        finally {

            setLoading(false);

        }

    };

    const filteredActivities = useMemo(() => {

        return activities.filter(activity => {

            const searchMatch =

                search === ""

                ||

                activity.description
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                activity.referenceName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                activity.performedBy
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const moduleMatch =

                moduleFilter === ""

                ||

                activity.module === moduleFilter;

            const actionMatch =

                actionFilter === ""

                ||

                activity.action === actionFilter;

            const roleMatch =

                roleFilter === ""

                ||

                activity.userRole === roleFilter;

            return (

                searchMatch

                &&

                moduleMatch

                &&

                actionMatch

                &&

                roleMatch

            );

        });

    }, [

        activities,

        search,

        moduleFilter,

        actionFilter,

        roleFilter

    ]);

    const handleView = (activity) => {

        setSelectedActivity(activity);

        setDialogOpen(true);

    };

    const handleCloseDialog = () => {

        setDialogOpen(false);

        setSelectedActivity(null);

    };

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={8}
            >

                <CircularProgress />

            </Box>

        );

    }

    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >

                System Activity

            </Typography>

            {

                error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >

                        {error}

                    </Alert>

                )

            }

            <ActivitySummaryCards

                activities={filteredActivities}

            />

            <Box mt={3}>

                <ActivityToolbar

                    search={search}

                    onSearchChange={setSearch}

                    module={moduleFilter}

                    onModuleChange={setModuleFilter}

                    action={actionFilter}

                    onActionChange={setActionFilter}

                    role={roleFilter}

                    onRoleChange={setRoleFilter}

                    onRefresh={loadActivities}

                />

            </Box>

            <Box mt={3}>

                <ActivityTable

                    activities={filteredActivities}

                    onView={handleView}

                />

            </Box>

            <ActivityDetailsDialog

                open={dialogOpen}

                activity={selectedActivity}

                onClose={handleCloseDialog}

            />

        </Box>

    );

}

export default SystemActivity;