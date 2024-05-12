/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    important: '#root',
    theme: {
        extend: {
            colors: {
                attention: '#FAF33E', // Yellow
                primary: '#3D518C',  // Blue
                secondary: '#ABD2FA', // Lighter blue 
                background: '#091540', // Dark blue
            }
        },
    },
    corePlugins: {
        // Remove the Tailwind CSS preflight styles so it can use Material UI's preflight instead (CssBaseline).
        preflight: false,
    },
    plugins: [],
};