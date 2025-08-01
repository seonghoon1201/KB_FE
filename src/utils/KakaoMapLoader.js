// 📁 src/utils/kakaoMapLoader.js

export const loadKakaoMapScript = () => {
    return new Promise((resolve) => {
        if (window.kakao && window.kakao.maps) {
            resolve(window.kakao)
            return
        }

        const script = document.createElement('script')

        script.onload = () => {
            window.kakao.maps.load(() => {
                resolve(window.kakao)
            })
        }

        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=03cbdb235220c6913e65af3e8cf6fa87&autoload=false&libraries=services`
        document.head.appendChild(script)
    })
}
