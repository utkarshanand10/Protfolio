import React from "react";
import { Sun, Moon } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";

export default function ThemeToggle() {
    const [colorTheme, setTheme] = useDarkMode();

    return (
        <button
            onClick={() => setTheme(colorTheme)}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all duration-300 active:scale-95"
            aria-label="Toggle theme"
        >
            {colorTheme === "dark" ? (
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            ) : (
                <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            )}
        </button>
    );
}
