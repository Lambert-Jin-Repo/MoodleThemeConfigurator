import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#404041',
        'cfa-orange': '#F27927',
        'cfa-purple': '#B500B5',
        'cfa-sky': '#00BFFF',
        'cfa-teal': '#336E7B',
        'cfa-lime': '#BAF73C',
        'cfa-red': '#F64747',
        'cfa-light-grey': '#F0EEEE',
      },
      fontFamily: {
        'source-sans': ['"Source Sans 3"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
