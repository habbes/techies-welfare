module.exports = {
  jit: true,
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif']
      },
      fontSize: {
        sm: ['10px', '10px'],
        base: ['14px', '20px'],
        lg: ['18px', '34px'],
        xl: ['24px', '34px']
      },
      colors: {
        bgd: '#E5E5E5',
        primary: {
          DEFAULT: '#7fbc42',
          light: '#99c968',
          dark: '#5c8830',
        },
        warning: {
          DEFAULT: '#ffb946',
          light: '#fff4ce'
        },
        danger: {
          DEFAULT:'#e16040',
          light: '#fde7e9',
          dark: '#e19f8f'
        },
        success: {
          DEFAULT: '#9bd165',
          dark: '#66910d',
          light: '#dff6dd'
        },
        secondary: {
          DEFAULT: '#0d3d6f',
          light: '#6483a3',
          dark: '#092c50'
        },
        tertiary: {
          DEFAULT:'#095ca5',
          light: '#c7d2e9'
        },
        dark: '#3f4a5b',
        body: '#707683',
        placeholder: '#9fa4ad',
        mute: '#f3f5f9',
        disabled: '#c1cad6',
        inputcolor: '#c7d2e9'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
