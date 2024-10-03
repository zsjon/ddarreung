import React, { useEffect, useRef } from 'react';

const NaverMap = ({ cctvRows, bikeMarkers, parkName, mapElementRef, selectedCctvLocation }) => {
    const mapRef = useRef(null);

    // 부채꼴을 그리는 함수
    const drawArc = (center, radius, startAngle, endAngle) => {
        const points = [];
        const angleStep = (endAngle - startAngle) / 100;

        for (let angle = startAngle; angle <= endAngle; angle += angleStep) {
            const radian = angle * (Math.PI / 180);
            const x = center.lng() + radius * Math.cos(radian) / 6378137 * (180 / Math.PI) / Math.cos(center.lat() * Math.PI / 180);
            const y = center.lat() + radius * Math.sin(radian) / 6378137 * (180 / Math.PI);
            points.push(new window.naver.maps.LatLng(y, x));
        }

        return points;
    };

    useEffect(() => {
        if (!mapElementRef.current || !window.naver) return;

        // 지도 초기화
        const selectedPark = cctvRows.find(row => row.parkName === parkName);
        if (!selectedPark) return;

        const location = new window.naver.maps.LatLng(parseFloat(selectedPark.cctvLat), parseFloat(selectedPark.cctvLon));

        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
        };

        const mapInstance = new window.naver.maps.Map(mapElementRef.current, mapOptions);
        mapRef.current = mapInstance;

        // CCTV 마커 생성
        if (cctvRows.length > 0) {
            cctvRows.forEach((row) => {
                const markerPosition = new window.naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));

                const marker = new window.naver.maps.Marker({
                    position: markerPosition,
                    map: mapInstance,
                    title: row.id,
                });

                // 화각을 그리는 부분 (고정형: 66도, 회전형: 180도)
                const radius = 50; // 부채꼴 반경
                const startAngle = 0;
                const endAngle = row.fixed ? 66 : 180; // 고정형이면 66도, 회전형이면 180도

                const arcPoints = drawArc(markerPosition, radius, startAngle, endAngle);

                const arcPolygon = new window.naver.maps.Polygon({
                    map: mapInstance,
                    paths: [markerPosition, ...arcPoints, markerPosition],
                    strokeColor: row.fixed ? '#00FF00' : '#FF0000', // 고정형은 녹색, 회전형은 빨간색
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: row.fixed ? '#00FF00' : '#FF0000', // 고정형은 녹색, 회전형은 빨간색
                    fillOpacity: 0.3,
                });
            });
        }
    }, [cctvRows, parkName]);

    // CCTV row 클릭 시 지도의 중심을 해당 CCTV로 이동하고 확대하는 효과를 추가
    useEffect(() => {
        if (!mapRef.current || !selectedCctvLocation) return;

        const location = new window.naver.maps.LatLng(
            parseFloat(selectedCctvLocation.cctvLat),
            parseFloat(selectedCctvLocation.cctvLon)
        );

        // 지도 중심을 해당 CCTV로 이동하고 줌 레벨을 확대
        mapRef.current.setCenter(location);
        mapRef.current.setZoom(18); // 확대 레벨 설정
    }, [selectedCctvLocation]);

    return <div ref={mapElementRef} style={{ width: '100%', height: '500px' }} />;
};

export default NaverMap;
