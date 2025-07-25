// 📁 src/utils/kakaoMapLoader.js

export const loadKakaoMapScript = () => {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao);
      return;
    }

    const script = document.createElement("script");
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve(window.kakao);
      });
    };
    script.src =
      `//dapi.kakao.com/v2/maps/sdk.js?appkey=50043506120eb6a0ceb86b492b3c9840&autoload=false`;
    document.head.appendChild(script);
  });
};
