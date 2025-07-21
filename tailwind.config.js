module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'sans-serif'],
        pretendard: ['Pretendard Variable', 'sans-serif'],
        noonnu: ['NoonnuBasicGothicRegular', 'sans-serif'],
        jalnan: ['JalnanGothic', 'sans-serif'],
      },
      height: {
        screen: '100vh', // 정확한 100vh 고정
      },
      minHeight: {
        screen: '100vh', // min-h-screen이 정확히 100vh로 되도록
      },
    },
  },
  plugins: [],
}
