import { useState, useEffect } from "react";

type Theme = "dark" | "light";

const useTheme = () => {
  const theme = "light";
  const toggleTheme = () => {};

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
  }, []);

  return { theme, toggleTheme };
};

export default useTheme;
