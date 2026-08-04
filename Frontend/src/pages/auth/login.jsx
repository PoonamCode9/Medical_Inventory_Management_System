import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography
} from "@mui/material";

import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";

import { loginUser } from "../../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {

        event.preventDefault();

        try {

            const response = await loginUser({
                email,
                password
            });

            localStorage.setItem(
                "userId",
                response.userId
            );

            localStorage.setItem(
                "token",
                response.token
            );

            localStorage.setItem(
                "email",
                response.email
            );

            localStorage.setItem(
                "name",
                response.name
            );

            localStorage.setItem(
                "role",
                response.role
            );

            if (response.role === "ADMIN") {

                navigate("/admin/dashboard");

            } else if (response.role === "STAFF") {

                navigate("/staff/dashboard");

            } else if (response.role === "PHARMACIST") {

                navigate("/pharmacist/dashboard");

            }

        } catch {

            alert("Invalid email or password.");

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
                                    color: "#1976D2"
                                }}
                            />

                        </Box>

                        <Typography
                            variant="h4"
                            align="center"
                            fontWeight="bold"
                        >
                            MediStock
                        </Typography>

                        <Typography
                            align="center"
                            color="text.secondary"
                            sx={{ mb: 4 }}
                        >
                            Pharmacy Inventory Management System
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleLogin}
                        >

                            <TextField
                                fullWidth
                                label="Email"
                                margin="normal"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />

                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                margin="normal"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    py: 1.3
                                }}
                            >
                                Sign In
                            </Button>

                        </Box>

                        <Typography
                            align="center"
                            sx={{ mt: 4 }}
                        >
                            Don't have an account?{" "}
                            <Link to="/register">
                                Register
                            </Link>
                        </Typography>

                    </CardContent>

                </Card>

            </Container>

        </Box>

    );

}

export default Login;