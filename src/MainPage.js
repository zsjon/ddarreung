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
import {Drawer} from "@mui/material";

const MainPage = () => {
    const mapElement = useRef(null);
    const { naver } = window;

    const rows = [
        { id: 1, object: "따릉이", latitude: "37.548769", longitude: "127.120038", address: "서울특별시 강동구 선사로 83-66" },
        { id: 2, object: "따릉이2", latitude: "37.521302", longitude: "126.984974", address: "서울특별시 용산구 서빙고로 185" },
        { id: 3, object: "따릉이3", latitude: "37.552973", longitude: "126.984190", address: "서울특별시 용산구 용산동2가" },
        { id: 4, object: "따릉이4", latitude: "37.493379", longitude: "126.919990", address: "서울특별시 동작구 여의대방로20길 33" },
        { id: 5, object: "따릉이5", latitude: "37.564087", longitude: "126.891791", address: "서울특별시 마포구 상암동 482" },
        { id: 6, object: "따릉이6", latitude: "37.526674", longitude: "126.934719", address: "서울특별시 영등포구 여의동로 330" }
    ];

    const [map, setMap] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // const [myLocation, setMyLocation] = useState({
    //     latitude: 37.4979517, // 초기값 = 강남역 좌표
    //     longitude: 127.0276188,
    // });

    const [myLocation, setMyLocation] = useState({
        latitude: 37.4979517, // 초기값 = 강남역 좌표
        longitude: 127.0276188,
    });

    useEffect(() => {
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setMyLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    () => {
                        // 오류 발생 시 기본 위치 설정 (강남역)
                        setMyLocation({
                            latitude: 37.4979517,
                            longitude: 127.0276188,
                        });
                    }
                );
            }
        };

        updateLocation();   // 페이지 로드마다 현재 위치를 갱신

        const intervalId = setInterval(updateLocation, 60000);  // 1분마다 내 위치를 업데이트할 수 있도록 setInterval 사용

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
    }, []);

    const seoulCenter = {   // 서울 중심을 기준으로 마커들을 표시하기 위해 생성함.
        latitude: 37.5505,
        longitude: 126.9780,
    };

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        const location = new naver.maps.LatLng(seoulCenter.latitude, seoulCenter.longitude);
        const mapOptions = {
            center: location,
            zoom: 12,
            zoomControl: true,
        };

        const newMap = new naver.maps.Map(mapElement.current, mapOptions);


        rows.forEach((row) => {
            new naver.maps.Marker({
                position: new naver.maps.LatLng(parseFloat(row.latitude), parseFloat(row.longitude)),
                map: newMap,
                title: row.object,
            });
        });

        setMap(newMap);
    }, [naver]);

    const handleObjectClick = (params) => {
        const row = rows.find(r => r.id === params.id);
        if (row) {
            const location = new naver.maps.LatLng(parseFloat(row.latitude), parseFloat(row.longitude));
            map.setCenter(location);
            map.setZoom(20);  // 확대 수준 조절

            // 드로어에 표시할 정보 설정
            setSelectedRow(row);
            setDrawerOpen(true);
        }
    };

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
                    onCellClick={handleObjectClick}
                    initialState={{
                        // pagination: {
                        //     paginationModel: {
                        //         pageSize: 5
                        //     },
                        // },   // 모든 rows를 한 페이지 안에 모두 보이게. 대신 DataGrid 컴포넌트 구성상 최대 100개까지만 보일 수 있음.
                    }}
                    // pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
            <Drawer
                anchor='left'
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {selectedRow && (
                    <Box p={2} width="250px" textAlign="center">
                        <h2>{selectedRow.object}</h2>
                        <img src={`https://via.placeholder.com/200`} alt="Placeholder" style={{ width: '100%', height: 'auto' }} />
                        <p>{selectedRow.address}</p>
                    </Box>
                )}
            </Drawer>
        </React.Fragment>
    );
};

export default MainPage;