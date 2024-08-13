import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { columns } from "./columns";
import { Drawer } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import guOptions from './GuOptions';

const MainPage = () => {
    const mapElement = useRef(null);
    const { naver } = window;

    const [rows, setRows] = useState([]);
    const [map, setMap] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedGu, setSelectedGu] = useState(''); // 사용자가 선택한 '구'를 저장

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "missing-seoul-bike"));
                const fetchedRows = querySnapshot.docs.map((doc, index) => ({
                    index: index + 1,
                    id: doc.data().id,
                    latitude: doc.data().lat,
                    longitude: doc.data().lon,
                    imageUrl: doc.data().imageUrl,
                }));

                const rowsWithAddress = await Promise.all(
                    fetchedRows.map(async (row) => {
                        const address = await getReverseGeocoding(row.latitude, row.longitude);
                        return { ...row, address };
                    })
                );

                setRows(rowsWithAddress);
            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };

        fetchData();
    }, []);

    // Reverse Geocoding을 사용하여 좌표에 따른 주소를 역추적하는 방식.
    const getReverseGeocoding = (latitude, longitude) => {
        return new Promise((resolve, reject) => {
            naver.maps.Service.reverseGeocode({
                coords: new naver.maps.LatLng(latitude, longitude),
                orders: [
                    naver.maps.Service.OrderType.ADDR,
                    naver.maps.Service.OrderType.ROAD_ADDR
                ].join(',')
            }, function(status, response) {
                if (status === naver.maps.Service.Status.ERROR) {
                    return reject('Reverse Geocoding failed');
                }

                const result = response.v2.results[0];  //받아온 지역의 주소를 단위별로 분할하여 최종 주소지를 도출
                const area1 = result.region.area1.name || '';
                const area2 = result.region.area2.name || '';
                const area3 = result.region.area3.name || '';
                const landName = result.land && result.land.name ? result.land.name : '';  // land.name이 없는 경우 빈 문자열로 처리
                const number1 = result.land && result.land.number1 ? result.land.number1 : 'No number';  // number1이 없는 경우 기본값 설정
                const number2 = result.land && result.land.number2 ? '-' + result.land.number2 : '';  // number2가 없는 경우 빈 문자열로 처리

                const fullAddress = `${area1} ${area2} ${area3} ${landName} ${number1}${number2}`;
                resolve(fullAddress);
            });
        });
    };

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        const location = new naver.maps.LatLng(37.5505, 126.9780);
        const mapOptions = {
            center: location,
            zoom: 12,
            zoomControl: true,
        };

        const newMap = new naver.maps.Map(mapElement.current, mapOptions);
        setMap(newMap);

        // Firestore에서 가져온 데이터 기반으로 마커 표시
        if (rows.length > 0) {
            rows.forEach((row) => {
                const markerPosition = new naver.maps.LatLng(parseFloat(row.latitude), parseFloat(row.longitude));

                // 마커 생성
                new naver.maps.Marker({
                    position: markerPosition,
                    map: newMap,
                    title: row.id,
                });
            });
        }
    }, [naver, rows]);

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

    const handleGuChange = (event) => {
        setSelectedGu(event.target.value); // 선택된 지역구를 업데이트
    };

    // 선택된 '구'에 따라 데이터를 필터링합니다.
    const filteredRows = selectedGu ? rows.filter(row => row.address.includes(selectedGu)) : rows;

    return (
        <React.Fragment>
            <div className='header-website'>
                <h1 className='title-website'>유실 따릉이 위치 현황</h1>
                <select className='button' onChange={handleGuChange} value={selectedGu}>
                    <option value="">전체 지역</option>
                    {guOptions.map(gu => (
                        <option key={gu} value={gu}>{gu}</option>
                    ))}
                </select>
            </div>
            <div ref={mapElement} className='map-naver-view'></div>
            <Box>
                <DataGrid
                    rows={filteredRows} // 선택된 지역구에 따라 필터링된 데이터를 표시
                    columns={columns}
                    onCellClick={handleObjectClick}
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
                        <h2>{selectedRow.id}</h2>
                        <img src={selectedRow.imageUrl} alt="Missing bike" style={{ width: '100%', height: 'auto' }} />
                        <p>{selectedRow.address}</p> {/* 해당 지역의 전체 주소 표시 */}
                    </Box>
                )}
            </Drawer>
        </React.Fragment>
    );
};

export default MainPage;