/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: 'sans-serif',
            fontWeight: theme('fontWeight.normal'),

        },
        },
        colors: {
          primary: '#FF0000',
          secondary: '#00FF00',
      },
      }),
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/typography'),
  ],
};
