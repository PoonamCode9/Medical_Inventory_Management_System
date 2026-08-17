

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
                ink: { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a',950:'#020617' },
                success: { DEFAULT:'#16a34a', bg:'#dcfce7', text:'#15803d' },
                warning: { DEFAULT:'#d97706', bg:'#fef3c7', text:'#b45309' },
                error: { DEFAULT:'#dc2626', bg:'#fee2e2', text:'#b91c1c' },
                info: { DEFAULT:'#0ea5b7', bg:'#cffafe', text:'#0e7490' },
            },
            fontFamily: { sans: ['Inter','system-ui','sans-serif'] },
            fontSize: { 13: ['0.8125rem', '1.15rem'] },
            boxShadow: {
                card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
                'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
                pop: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
            },
            keyframes: {
                'fade-in': { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
                'slide-up': { '0%': { opacity: 0, transform: 'translateY(8px) scale(0.98)' }, '100%': { opacity: 1, transform: 'translateY(0) scale(1)' } },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-up': 'slide-up 0.2s ease-out',
            },
        },
    },
    plugins: [],
};
