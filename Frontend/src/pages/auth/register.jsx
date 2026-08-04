import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";

import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";

import { getRoles, registerUser } from "../../services/authService";

function Register() {

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        roleId: ""
    });

    useEffect(() => {

        const fetchRoles = async () => {

            try {

                const response = await getRoles();

                setRoles(
                    response.filter(role => role.roleName !== "ADMIN")
                );

            } catch {

                alert("Unable to load roles.");

            }

        };

        fetchRoles();

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            await registerUser(formData);

            alert("Registration Successful!");

            navigate("/");

        } catch {

            alert("Registration Failed.");

        }

    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F4F6F8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <Container maxWidth="sm">

                <Card
                    elevation={3}
                    sx={{
                        borderRadius: 3
                    }}
                >

                    <CardContent sx={{ p: 5 }}>

                        <Box
                            display="flex"
                            justifyContent="center"
                            mb={2}
                        >
                            <LocalPharmacyRoundedIcon
                                sx={{
                                    fontSize: 48,
                                    color: "#1976d2"
                                }}
                            />
                        </Box>

                        <Typography
                            variant="h4"
                            align="center"
                            fontWeight="bold"
                        >
                            Create Account
                        </Typography>

                        <Typography
                            align="center"
                            color="text.secondary"
                            sx={{ mb: 4 }}
                        >
                            Register to use MediStock
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleRegister}
                        >

                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                margin="normal"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                margin="normal"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                margin="normal"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <TextField
                                select
                                fullWidth
                                label="Role"
                                name="roleId"
                                margin="normal"
                                value={formData.roleId}
                                onChange={handleChange}
                            >
                                {roles.map(role => (
                                    <MenuItem
                                        key={role.roleId}
                                        value={role.roleId}
                                    >
                                        {role.roleName}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    py: 1.3
                                }}
                            >
                                Create Account
                            </Button>

                        </Box>

                        <Typography
                            align="center"
                            sx={{ mt: 4 }}
                        >
                            Already have an account?{" "}
                            <Link to="/">
                                Sign In
                            </Link>
                        </Typography>

                    </CardContent>

                </Card>

            </Container>

        </Box>

    );

}

export default Register;