import {
    Grid,
    MenuItem,
    TextField
} from "@mui/material";

function UserForm({
    formData,
    onChange,
    isEdit = false
}) {

    return (

        <Grid
            container
            spacing={2}
        >

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                />

            </Grid>

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                />

            </Grid>

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    label={
                        isEdit
                            ? "Password (Leave blank to keep current password)"
                            : "Password"
                    }
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={onChange}
                    required={!isEdit}
                />

            </Grid>

            <Grid size={{ xs: 12 }}>

                <TextField
                    select
                    fullWidth
                    label="Role"
                    name="roleId"
                    value={formData.roleId}
                    onChange={onChange}
                    required
                >

                    <MenuItem value={1}>
                        Admin
                    </MenuItem>

                    <MenuItem value={2}>
                        Staff
                    </MenuItem>

                    <MenuItem value={3}>
                        Pharmacist
                    </MenuItem>

                </TextField>

            </Grid>

        </Grid>

    );

}

export default UserForm;