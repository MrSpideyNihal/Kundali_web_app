/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'devanagari': ['"Noto Sans Devanagari"', 'sans-serif'],
            },
            colors: {
                'vedic': {
                    primary: '#FF6B35',
                    secondary: '#004E89',
                    accent: '#F77F00',
                    dark: '#1A1A2E',
                    light: '#F7F7F7'
                }
            }
        },
    },
    plugins: [],
}
