/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        customRed: '#FF0000', // Add red for the checkbox
        customGreen: '#224957', // Add green if needed
      },
      ringColor: {
        customGreen: '#2BD17E', // Add a custom green for focus rings
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked'], // Ensure `checked` works for background
      textColor: ['checked'], // Ensure `checked` works for text
      ringWidth: ['focus'], // Ensure ring width works on focus
      ringColor: ['focus'], // Ensure ring color works on focus
    },
  },
  plugins: [],
};
