module.exports = {
  content: [
<<<<<<< HEAD
    './index.html',
    './src/**/*.{vue,js,jsx}',
=======
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
>>>>>>> upstream/main
  ],
  theme: {
    extend: {
      fontFamily: {
<<<<<<< HEAD
        sans: ['Jal_Haru', 'sans-serif'], // Tailwind 기본 sans를 덮어씀
         pretendard: ['Pretendard-Regular', 'sans-serif'], // 나중에 사용할 때 class = "font-pretendard" 적용하면 됨
=======
        sans: ['Pretendard Variable', 'sans-serif'], // 본문 기본 폰트
        pretendard: ['Pretendard Variable', 'sans-serif'],
        noonnu: ['NoonnuBasicGothicRegular', 'sans-serif'], // 쓸 때 클래스 명에 font-noonnu 적용하면 됨
        jalnan: ['JalnanGothic', 'sans-serif'],
>>>>>>> upstream/main
      },
    },
  },
  plugins: [],
<<<<<<< HEAD
};
=======
}
>>>>>>> upstream/main
