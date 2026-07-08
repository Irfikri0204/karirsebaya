import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                'brand-dark': '#15092a',
                'brand-primary': '#6b21a8',
                'brand-light': '#f8f5fd',
                'brand-purple': '#3b0764',
                'brand-accent': '#a855f7',
                'brand-card': '#27124a',
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                serif: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [
        forms,
        require('@tailwindcss/typography'),
    ],
};
