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

// import React, { useEffect, useRef, useState } from 'react';
// import Box from '@mui/material/Box';
// import { DataGrid } from '@mui/x-data-grid';
// import {columns} from "./columns";
//
// const MainPage = () => {
//     const mapElement = useRef(null);
//     const { naver } = window;
//
//     const [myLocation, setMyLocation] = useState({});
//
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(success, error);
//         }
//         if (!mapElement.current || !naver) return;
//
//         const location = new naver.maps.LatLng(myLocation.latitude, myLocation.longitude);
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
//     }, [mapElement, myLocation]);
//
//     const rows = [
//         {object: "따릉이", location: "111"},
//         {object: "따릉이", location: "111"},
//         {object: "따릉이", location: "111"},
//         {object: "따릉이", location: "111"},
//         {object: "따릉이", location: "111"},
//         {object: "따릉이", location: "111"}
//     ];
//
//     return (
//         <React.Fragment>
//             <h1>Naver Map - Current Position</h1>
//             <div ref={mapElement} style={{ minHeight: '400px' }}>
//         </div>
//         <Box>
//             <DataGrid
//                 rows={rows.rows}
//                 columns={columns}
//                 initialState={{
//                     pagination: {
//                         paginationModel: {
//                             pageSize: 5
//                         },
//                     },
//                 }}
//                 pageSizeOptions={[5]}
//                 checkboxSelection
//                 disableRowSelectionOnClick
//             />
//         </Box>
//         </React.Fragment>
//     );
//
//     // 위치추적에 성공했을때 위치 값을 넣어줍니다.
//     function success(position) {
//         setMyLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//         });
//     }
//
//     // 위치 추적에 실패 했을때 초기값을 넣어줍니다.
//     function error() {
//         setMyLocation({ latitude: 37.4979517, longitude: 127.0276188 }); //강남역 좌표
//     }
// };
//
// export default MainPage;

import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { columns } from "./columns";

const MainPage = () => {
    const mapElement = useRef(null);
    const { naver } = window;

    const rows = [
        { id: 1, object: "따릉이", latitude: "37.548769", longitude: "127.120038" },
        { id: 2, object: "따릉이2", latitude: "37.521302", longitude: "126.984974" },
        { id: 3, object: "따릉이3", latitude: "37.552973", longitude: "126.984190" },
        { id: 4, object: "따릉이4", latitude: "37.493379", longitude: "126.919990" },
        { id: 5, object: "따릉이5", latitude: "37.564087", longitude: "126.891791" },
        { id: 6, object: "따릉이6", latitude: "37.526674", longitude: "126.934719" }
    ];

    const [myLocation, setMyLocation] = useState({
        latitude: 37.4979517, // 초기값 = 강남역 좌표
        longitude: 127.0276188,
    });

    // useEffect(() => {   // 현재 위치 자동 업데이트 기능 --> 굳이 필요는 없을듯
    //     const updateLocation = () => {
    //         if (navigator.geolocation) {
    //             navigator.geolocation.getCurrentPosition(
    //                 (position) => {
    //                     setMyLocation({
    //                         latitude: position.coords.latitude,
    //                         longitude: position.coords.longitude,
    //                     });
    //                 },
    //                 () => {
    //                     // 오류 발생 시 기본 위치 설정 (강남역)
    //                     setMyLocation({
    //                         latitude: 37.4979517,
    //                         longitude: 127.0276188,
    //                     });
    //                 }
    //             );
    //         }
    //     };
    //     updateLocation();   // 페이지 로드마다 현재 위치를 갱신
    //
    //     const intervalId = setInterval(updateLocation, 60000);  // 1분마다 내 위치를 업데이트할 수 있도록 setInterval 사용
    //
    //     return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
    // }, []);

    const seoulCenter = {   // 서울 중심을 기준으로 마커들을 표시하기 위해 생성함.
        latitude: 37.5505,
        longitude: 126.9780,
    };

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        const location = new naver.maps.LatLng(seoulCenter.latitude, seoulCenter.longitude);
        const mapOptions = {
            center: location,
            zoom: 12,  // 서울시 전체를 볼 수 있는 줌 레벨 설정
            zoomControl: true,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);

        // 각 row에 대해 Marker를 생성하여 지도에 추가합니다.
        rows.forEach((row) => {
            new naver.maps.Marker({
                position: new naver.maps.LatLng(parseFloat(row.latitude), parseFloat(row.longitude)),
                map: map,
                title: row.object,
            });
        });

    }, [myLocation, rows]);

    return (
        <React.Fragment>
            <div className='header-website'>
                <h1 className='title-website'>유실 따릉이 위치 현황</h1>
                <select className='button'>
                    <option>지역 선택</option>
                    <option>한강공원 반포지구</option>
                    <option>한강공원 잠실지구</option>
                    <option>보라매공원</option>
                    <option>남산공원</option>
                </select>

            </div>
            <div ref={mapElement} className='map-naver-view'></div>
            <Box>
                <DataGrid
                    rows={rows} //위 rows의 임의 데이터를 데이터그리드에 적용.
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </React.Fragment>
    );
};

export default MainPage;