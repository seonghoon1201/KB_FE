module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jal_Haru', 'sans-serif'], // Tailwind 기본 sans를 덮어씀
         pretendard: ['Pretendard-Regular', 'sans-serif'], // 나중에 사용할 때 class = "font-pretendard" 적용하면 됨
      },
    },
  },
  plugins: [],
};
