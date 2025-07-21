module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'sans-serif'], // 본문 기본 폰트
        pretendard: ['Pretendard Variable', 'sans-serif'],
        noonnu: ['NoonnuBasicGothicRegular', 'sans-serif'], // 쓸 때 클래스 명에 font-noonnu 적용하면 됨
        jalnan: ['JalnanGothic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
