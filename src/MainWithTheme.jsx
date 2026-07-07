import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { useThemeStore } from "./store/useThemeStore";

export default function MainWithTheme() {
  const darkMode = useThemeStore((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <App />
    </BrowserRouter>
  );
}
