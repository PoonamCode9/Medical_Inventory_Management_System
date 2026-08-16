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

            {/* NAME */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    size="small"
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                />

            </Grid>


            {/* EMAIL */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                />

            </Grid>


            {/* PASSWORD */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    fullWidth
                    size="small"
                    label={
                        isEdit
                            ? "Password (leave blank to keep current)"
                            : "Password"
                    }
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={onChange}
                    required={!isEdit}
                />

            </Grid>


            {/* ROLE */}

            <Grid size={{ xs: 12 }}>

                <TextField
                    select
                    fullWidth
                    size="small"
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