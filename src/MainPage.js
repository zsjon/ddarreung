// import { useEffect, useRef } from 'react';
//
// const MainPage = () => {
//     const mapElement = useRef(null);
//     const { naver } = window;
//
//     useEffect(() => {
//         if (!mapElement.current || !naver) return;
//
//         // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
//         const location = new naver.maps.LatLng(37.5656, 126.9769);
//         const mapOptions = {
//             center: location,
//             zoom: 17,
//             zoomControl: true,
//         };
//
//         const map = new naver.maps.Map(mapElement.current, mapOptions);
//         new naver.maps.Marker({
//             position: location,
//             map,
//         });
//     }, []);
//
//     return (
//         <>
//             <h1>Naver Map - Default</h1>
//             <div ref={mapElement} style={{ minHeight: '400px' }} />
//         </>
//     );
// };
//
// export default MainPage;

import { useEffect, useRef, useState } from 'react';

const MainPage = () => {
    const mapElement = useRef(null);
    const { naver } = window;

    const [myLocation, setMyLocation] = useState({});

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }
        if (!mapElement.current || !naver) return;

        const location = new naver.maps.LatLng(myLocation.latitude, myLocation.longitude);
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);
        new naver.maps.Marker({
            position: location,
            map,
        });
    }, [mapElement, myLocation]);

    return (
        <>
            <h1>Naver Map - Current Position</h1>
            <div ref={mapElement} style={{ minHeight: '400px' }} />
        </>
    );

    // 위치추적에 성공했을때 위치 값을 넣어줍니다.
    function success(position) {
        setMyLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    }

    // 위치 추적에 실패 했을때 초기값을 넣어줍니다.
    function error() {
        setMyLocation({ latitude: 37.4979517, longitude: 127.0276188 });
    }
};

export default MainPage;