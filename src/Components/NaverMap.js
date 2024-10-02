import {useEffect} from "react";
import parkData from "../parkList.json";
// Naver Map API 컴포넌트
const NaverMap = ({ cctvRows, bikeMarkers, parkName, mapElementRef, onMarkerClick }) => {
    useEffect(() => {
        if (!mapElementRef.current || !window.naver) return;

        const selectedPark = parkData.DATA.find(park => park.p_park === parkName);
        if (!selectedPark) return;

        const location = new window.naver.maps.LatLng(parseFloat(selectedPark.latitude), parseFloat(selectedPark.longitude));
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
        };

        const newMap = new window.naver.maps.Map(mapElementRef.current, mapOptions);

        cctvRows.forEach((row) => {
            const markerPosition = new window.naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));
            const marker = new window.naver.maps.Marker({
                position: markerPosition,
                map: newMap,
                title: row.id,
            });

            // 마커 클릭 시 동작 설정
            window.naver.maps.Event.addListener(marker, 'click', () => {
                onMarkerClick(row);
            });
        });

        // 새로운 bikeMarkers를 지도에 표시
        bikeMarkers.forEach(marker => marker.setMap(newMap));
    }, [cctvRows, bikeMarkers, parkName]);

    return <div ref={mapElementRef} className='map-naver-view'></div>;
};

export default NaverMap;
