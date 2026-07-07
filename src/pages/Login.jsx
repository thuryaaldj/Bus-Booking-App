import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import RouteIcon from "@mui/icons-material/Route";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";

const adminUsernames = ["ronahi", "emilys"];
const demoUsers = {
  customer: { password: "customer123", role: "customer" },
  esraa: { password: "customer123", role: "customer" },
  ronahi: { password: "admin123", role: "admin" },
};

const getUserRole = (username) =>
  adminUsernames.includes(username.trim().toLowerCase()) ? "admin" : "customer";

const getHomeRoute = (role) => (role === "admin" ? "/admin" : "/trips");

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const darkMode = useThemeStore((state) => state.darkMode);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRole) {
      navigate(getHomeRoute(savedRole), { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const normalizedUsername = username.trim().toLowerCase();
      const demoUser = demoUsers[normalizedUsername];

      if (demoUser && password === demoUser.password) {
        login(`demo-${demoUser.role}-token`, demoUser.role);
        navigate(getHomeRoute(demoUser.role), { replace: true });
        return;
      }

      const { data } = await axios.post(
        "https://dummyjson.com/auth/login",
        { username, password }
      );

      const token = data.token || data.accessToken;
      const role = getUserRole(username);

      if (!token) {
        throw new Error("Login response did not include a token");
      }

      login(token, role);

      const requestedPath = location.state?.from?.pathname;
      const canUseRequestedPath =
        requestedPath && (role === "admin" || !requestedPath.startsWith("/admin"));

      navigate(canUseRequestedPath ? requestedPath : getHomeRoute(role), {
        replace: true,
      });

    } catch (err) {
      console.error(err);
      setError("Username or password is incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          alignItems: "center",
          background: darkMode
            ? "linear-gradient(135deg, #1f1147 0%, #4c1d95 55%, #111827 100%)"
            : "linear-gradient(135deg, #ede9fe 0%, #faf5ff 50%, #ffffff 100%)",
          display: "flex",
          minHeight: "100vh",
          p: { xs: 2, md: 6 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 8 }}
          sx={{ alignItems: "center", mx: "auto", width: "100%", maxWidth: 1120 }}
        >
          <Stack spacing={3} sx={{ color: darkMode ? "white" : "#2e1065", flex: 1 }}>
            <Typography
              component="p"
              sx={{
                color: darkMode ? "#ddd6fe" : "#6d28d9",
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Bus Booking App
            </Typography>
            <Typography component="h1" variant="h3" sx={{ fontWeight: 800 }}>
              Book smarter bus trips with Bus Trips.
            </Typography>
            <Typography sx={{ color: darkMode ? "#ddd6fe" : "#6b21a8", maxWidth: 520 }}>
              Sign in to browse available trips, reserve seats, or manage trips from the admin
              dashboard.
            </Typography>
            <Box
              sx={{
                bgcolor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(124,58,237,0.08)",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.18)" : "rgba(124,58,237,0.18)"}`,
                borderRadius: 5,
                display: { xs: "none", md: "block" },
                maxWidth: 440,
                overflow: "hidden",
                p: 3,
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  bgcolor: darkMode ? "#ede9fe" : "#7c3aed",
                  borderRadius: 4,
                  color: darkMode ? "#4c1d95" : "white",
                  display: "flex",
                  height: 150,
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <DirectionsBusFilledIcon sx={{ fontSize: 96 }} />
              </Box>
              <Stack direction="row" spacing={2}>
                <Box
                  sx={{
                    bgcolor: darkMode ? "rgba(255,255,255,0.12)" : "white",
                    borderRadius: 3,
                    color: darkMode ? "#ddd6fe" : "#4c1d95",
                    flex: 1,
                    p: 2,
                  }}
                >
                  <RouteIcon />
                  <Typography sx={{ fontWeight: 700 }}>Routes</Typography>
                  <Typography variant="body2">Filter trips by city and price.</Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: darkMode ? "rgba(255,255,255,0.12)" : "white",
                    borderRadius: 3,
                    color: darkMode ? "#ddd6fe" : "#4c1d95",
                    flex: 1,
                    p: 2,
                  }}
                >
                  <EventSeatIcon />
                  <Typography sx={{ fontWeight: 700 }}>Seats</Typography>
                  <Typography variant="body2">Reserve seats in a few clicks.</Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>

          <Card
            sx={{
              bgcolor: darkMode ? "rgba(31, 17, 71, 0.92)" : "rgba(255, 255, 255, 0.96)",
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.14)" : "rgba(124,58,237,0.14)"}`,
              borderRadius: 5,
              boxShadow: darkMode
                ? "0 24px 60px rgba(0, 0, 0, 0.5)"
                : "0 24px 60px rgba(76, 29, 149, 0.18)",
              flex: 1,
              maxWidth: 460,
              width: "100%",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Stack spacing={3}>
                <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Box>
                    <Typography
                      component="h2"
                      variant="h4"
                      sx={{ color: darkMode ? "white" : "#2e1065", fontWeight: 800 }}
                    >
                      Welcome back
                    </Typography>
                    <Typography sx={{ color: darkMode ? "#ddd6fe" : "text.secondary" }}>
                      Enter your username and password.
                    </Typography>
                  </Box>
                </Stack>

                <Box component="form" onSubmit={handleLogin}>
                  <Stack spacing={2.5}>
                    <TextField
                      autoComplete="username"
                      autoFocus
                      fullWidth
                      label="Username"
                      placeholder="emilys"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextField
                      autoComplete="current-password"
                      fullWidth
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button
                      disabled={isLoading}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: "#6d28d9",
                        borderRadius: 2,
                        py: 1.4,
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "#5b21b6",
                        },
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress color="inherit" size={24} />
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </Stack>
                </Box>

                <Alert severity="info" variant="outlined">
                  Customer demo: <strong>customer</strong> / <strong>customer123</strong>.
                  Admin demo: <strong>ronahi</strong> / <strong>admin123</strong>.
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </>
  );
}
