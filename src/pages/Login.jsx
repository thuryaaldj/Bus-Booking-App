import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { Sun, Moon } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { darkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        // "https://90cc-185-107-56-220.ngrok-free.app/api/Auth/login",
        'https://dummyjson.com/auth/login',
        { username, password }
      );

      const { token } = data;

      let role = "customer";
      if (username == "ronahi"||username=="emilys"  ) role = "admin";
      if (username == "esraa") role = "customer";

      login(token, role);

      navigate(role === "admin" ? "/admin" : "/trips");

    } catch (err) {
      console.error(err);
      setError("Username or password is incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col justify-center px-12 py-10 w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">Please enter your details</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="text-violet-600 dark:text-yellow-400 hover:scale-110 transition-transform"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>
            <Input
              type="text"
              placeholder="kminchelle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            onClick={handleLogin}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center w-full bg-violet-100 dark:bg-violet-900 transition-colors duration-300">
        <img src="/img1.png" alt="Bus" className="max-w-md" />
      </div>
    </div>
  );
}
