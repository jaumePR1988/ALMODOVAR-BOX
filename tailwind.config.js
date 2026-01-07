/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "brand-red": "#E30031",
                "brand-dark": "#292C3D",
                "brand-surface": "#1E212B",
                "brand-bg": "#12141C",
                "brand-gray": "#8C919D",
                "background-light": "#F8F9FA",
                "text-primary": "#292C3D",
                "primary": "#E30031",
                "dark-text-main": "#FFFFFF",
                "dark-text-muted": "#9CA3AF",

                // User Provided Specifics (Strict Match)
                primary: "#D90429",
                secondary: "#1F2937",
                "background-light": "#F3F4F6",
                "background-dark": "#111827",
                "card-light": "#FFFFFF",
                "card-dark": "#1F2937",
                "text-light": "#1F2937",
                "text-dark": "#F9FAFB",
                "coach-red": "#D90429", // Keeping alias just in case
            },
            fontFamily: {
                "display": ["Montserrat", "sans-serif"],
                "sans": ["Montserrat", "sans-serif"],
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(41, 44, 61, 0.08)',
                'glow': '0 0 20px -5px rgba(227, 0, 49, 0.3)',
            }
        },
    },
    plugins: [],
}
