import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Drawer, Modal } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import ParkOptions from './ParkOptions';
import { columns_CCTV } from "./columns_CCTV";
import { columns_Lost } from "./columns_Lost";

const MainPage = () => {
    const mapElement = useRef(null);
    const { naver } = window;

    const [cctvRows, setCctvRows] = useState([]);
    const [visibleCctvRows, setVisibleCctvRows] = useState([]); // 화면에 표시되는 CCTV 데이터
    const [bikeRows, setBikeRows] = useState([]);
    const [visibleBikeRows, setVisibleBikeRows] = useState([]); // 선택된 CCTV 범위 내의 유실 따릉이 데이터
    const [map, setMap] = useState(null);
    const [circle, setCircle] = useState(null); // 원을 관리할 상태
    const [bikeMarkers, setBikeMarkers] = useState([]); // 유실 따릉이 마커를 관리할 상태
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedGu, setSelectedGu] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    // Firestore에서 CCTV 데이터를 가져오는 함수
    useEffect(() => {
        const fetchCCTVData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "seoul-cctv"));
                const fetchedRows = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    cctvLat: doc.data().cctvLat,
                    cctvLon: doc.data().cctvLon,
                    imageUrl: doc.data().imageUrl,
                    cctvAddress: '',
                    foundLost: doc.data().foundLost,
                    foundTime: doc.data().cctvFoundTime.toDate(),
                }));

                const rowsWithAddress = await Promise.all(
                    fetchedRows.map(async (row) => {
                        const address = await getReverseGeocoding(row.cctvLat, row.cctvLon);
                        return { ...row, cctvAddress: address };
                    })
                );

                setCctvRows(rowsWithAddress);
                setVisibleCctvRows(rowsWithAddress); // 초기에는 모든 CCTV를 표시
            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };

        fetchCCTVData();
    }, []);

    // Firestore에서 자전거 데이터를 가져오는 함수
    useEffect(() => {
        const fetchBikeData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "missing-seoul-bike"));
                const fetchedRows = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    latitude: doc.data().lat,
                    longitude: doc.data().lon,
                    imageUrl: doc.data().imageUrl,
                    foundTime: doc.data().bikeFoundTime.toDate(),
                }));

                setBikeRows(fetchedRows);
            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };

        fetchBikeData();
    }, []);

    // Reverse Geocoding을 사용하여 좌표에 따른 주소를 역추적하는 함수
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

                const result = response.v2.results[0];
                const area1 = result.region.area1.name || '';
                const area2 = result.region.area2.name || '';
                const area3 = result.region.area3.name || '';
                const landName = result.land && result.land.name ? result.land.name : '';
                const number1 = result.land && result.land.number1 ? result.land.number1 : 'No number';
                const number2 = result.land && result.land.number2 ? '-' + result.land.number2 : '';

                const fullAddress = `${area1} ${area2} ${area3} ${landName} ${number1}${number2}`;
                resolve(fullAddress);
            });
        });
    };

    // 좌표 간의 거리를 계산하는 함수 (단위: 미터)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // 지구의 반지름 (단위: 미터)
        const φ1 = lat1 * (Math.PI / 180);
        const φ2 = lat2 * (Math.PI / 180);
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // 두 점 사이의 거리 (단위: 미터)
        return distance;
    };

    // 지도 초기화 및 마커 표시 함수
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

        if (cctvRows.length > 0) {
            cctvRows.forEach((row) => {
                const markerPosition = new naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));

                new naver.maps.Marker({
                    position: markerPosition,
                    map: newMap,
                    title: row.id,
                });
            });
        }

        // 지도 이동 또는 확대 이벤트 발생 시 필터링된 CCTV 마커만 표시
        naver.maps.Event.addListener(newMap, 'idle', () => {
            updateVisibleMarkers(newMap);
        });
    }, [naver, cctvRows]);

    // 지도 범위 내의 마커들을 업데이트하는 함수
    const updateVisibleMarkers = (currentMap) => {
        const bounds = currentMap.getBounds();

        const filteredCCTV = cctvRows.filter(row => {
            const latlng = new naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));
            return bounds.hasLatLng(latlng);
        });

        // 지도에서 모든 마커 삭제 후 필터링된 마커 다시 표시
        currentMap.markers && currentMap.markers.forEach(marker => marker.setMap(null)); // 기존 마커 삭제
        currentMap.markers = []; // 마커 배열 초기화

        filteredCCTV.forEach((row) => {
            const markerPosition = new naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));

            const marker = new naver.maps.Marker({
                position: markerPosition,
                map: currentMap,
                title: row.id,
            });

            currentMap.markers.push(marker); // 새로운 마커 저장
        });

        setVisibleCctvRows(filteredCCTV); // DataGrid에 필터링된 CCTV 데이터만 표시
    };

    // CCTV 목록에 있는 CCTV 클릭 시의 변화
    const handleObjectClick = (params) => {
        const row = visibleCctvRows.find(r => r.id === params.id);
        if (row) {
            const location = new naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));
            map.setCenter(location);
            map.setZoom(17);

            // 기존에 그려진 원과 마커가 있으면 제거
            if (circle) {
                circle.setMap(null);
            }
            bikeMarkers.forEach(marker => marker.setMap(null));

            // 새로운 원을 그리기
            const newCircle = new naver.maps.Circle({
                map: map,
                center: location,
                radius: 50, // 반지름 50m
                strokeColor: '#5347AA',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#E5E5FF',
                fillOpacity: 0.5,
            });

            setCircle(newCircle); // 상태에 저장하여 다음 클릭 때 삭제 가능하게 설정

            // 원 내의 유실 따릉이 찾기
            const filteredBikes = bikeRows.filter(bike => {
                const distance = calculateDistance(
                    parseFloat(row.cctvLat),
                    parseFloat(row.cctvLon),
                    parseFloat(bike.latitude),
                    parseFloat(bike.longitude)
                );
                return distance <= newCircle.getRadius();
            });

            // 유실 따릉이 마커 추가
            const newBikeMarkers = filteredBikes.map(bike => {
                const bikeMarker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(parseFloat(bike.latitude), parseFloat(bike.longitude)),
                    map: map,
                    icon: {
                        content: '<div style="background-color:red;width:10px;height:10px;border-radius:50%;"></div>',
                        anchor: new naver.maps.Point(5, 5),
                    },
                    title: bike.id,
                });
                return bikeMarker;
            });

            setBikeMarkers(newBikeMarkers);
            setVisibleBikeRows(filteredBikes); // 모달에 표시할 유실 따릉이 데이터 업데이트

            setSelectedRow(row);
            setDrawerOpen(true);
        }
    };

    // Option에 있는 공원 목록 선택 시 변화
    const handleGuChange = (event) => {
        setSelectedGu(event.target.value);

        if (event.target.value === "") {
            // "공원 목록" 옵션이 선택된 경우 초기 상태로 되돌리기
            const seoulCenter = new naver.maps.LatLng(37.5505, 126.9780);
            map.setCenter(seoulCenter);
            map.setZoom(12);
            setVisibleCctvRows(cctvRows); // 모든 CCTV를 다시 표시
            return;
        }

        const selectedPark = ParkOptions.find(park => park.name === event.target.value);
        if (selectedPark && map) {
            const parkLocation = new naver.maps.LatLng(selectedPark.lat, selectedPark.lon);
            map.setCenter(parkLocation);
            map.setZoom(19);

            // 현재 보이는 지도 범위 내의 CCTV 마커만 표시
            updateVisibleMarkers(map);
        }
    };

    // 이미지 클릭 시 모달 창 열기
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalOpen(true);
    };

    // 모달 창 닫기
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedImage('');
    };

    return (
        <React.Fragment>
            <div className='header-website'>
                <h1 className='title-website'>유실 따릉이 위치 현황</h1>
                <select className='button' onChange={handleGuChange} value={selectedGu}>
                    <option value="">공원 목록</option>
                    {ParkOptions.map(park => (
                        <option key={park.name} value={park.name}>{park.name}</option>
                    ))}
                </select>
            </div>
            <div ref={mapElement} className='map-naver-view'></div>
            <Box>
                <DataGrid
                    rows={visibleCctvRows} // 필터링된 CCTV 데이터만 표시
                    columns={columns_CCTV}
                    onCellClick={handleObjectClick}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    pagination
                />
            </Box>
            <Drawer
                anchor='left'
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {selectedRow && (
                    <Box p={2} width="500px" textAlign="center">
                        <h2>{selectedRow.id}</h2>
                        <img
                            src={selectedRow.imageUrl}
                            alt="CCTV Image"
                            style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                            onClick={() => handleImageClick(selectedRow.imageUrl)}
                        />
                        <p>{selectedRow.cctvAddress}</p>
                        <p>해당 CCTV가 보여주는 따릉이명, 좌표</p>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={visibleBikeRows} // 필터링된 유실 따릉이 데이터만 표시
                                columns={columns_Lost}
                                checkboxSelection
                                disableRowSelectionOnClick
                                pageSize={10}
                                rowsPerPageOptions={[10, 20, 50]}
                                pagination
                                autoHeight
                            />
                        </Box>
                    </Box>
                )}
            </Drawer>
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1200,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4
                }}>
                    <img src={selectedImage} alt="Expanded CCTV" style={{ width: '100%', height: 'auto' }} />
                </Box>
            </Modal>
        </React.Fragment>
    );
};

export default MainPage;