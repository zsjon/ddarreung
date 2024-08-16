export const getSeoulForestBoundary = (naver) => {
    return new naver.maps.Polyline({
        path: [
            new naver.maps.LatLng(37.5464, 127.0419),
            new naver.maps.LatLng(37.5450, 127.0435),
            new naver.maps.LatLng(37.5436, 127.0431),
            new naver.maps.LatLng(37.5425, 127.0417),
            new naver.maps.LatLng(37.5433, 127.0395),
            new naver.maps.LatLng(37.5451, 127.0388),
            new naver.maps.LatLng(37.5465, 127.0398),
            new naver.maps.LatLng(37.5474, 127.0413),
            new naver.maps.LatLng(37.5464, 127.0419) // 마지막 점에서 처음 점으로 돌아와 경로를 닫습니다.
        ],
        strokeColor: '#FF0000',
        strokeWeight: 2,
        strokeOpacity: 1.0,
    });
};