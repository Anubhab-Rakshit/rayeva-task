/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                void: '#020807',
                surface: '#060f0a',
                'green-neon': '#86efac',
                'green-bright': '#4ade80',
                'green-mid': '#22c55e',
                'green-dim': '#1a4a2e',
            },
            fontFamily: {
                'sans': ['Instrument Sans', 'sans-serif'],
                'mono': ['Geist Mono', 'monospace'],
                'display': ['Cabinet Grotesk', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
