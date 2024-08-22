import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Drawer, Modal, Button } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import ParkOptions from './ParkOptions'; // 전체 공원 목록
import { columns_CCTV } from "./columns_CCTV";
import { columns_Lost } from "./columns_Lost";

// CCTV 방향 저장 객체 (로컬 스토리지에서 불러오기)
const getCctvDirections = () => {
    const storedDirections = localStorage.getItem('cctvDirections');
    return storedDirections ? JSON.parse(storedDirections) : {};
};

const cctvDirections = getCctvDirections();

const saveCctvDirections = () => {
    localStorage.setItem('cctvDirections', JSON.stringify(cctvDirections));
};

const MainPage = () => {
    const mapElement = useRef(null);
    const { naver } = window;

    const [cctvRows, setCctvRows] = useState([]);
    const [visibleCctvRows, setVisibleCctvRows] = useState([]);
    const [filteredParkOptions, setFilteredParkOptions] = useState([]);
    const [visibleBikeRows, setVisibleBikeRows] = useState([]);
    const [map, setMap] = useState(null);
    const [circle, setCircle] = useState(null);
    const [bikeMarkers, setBikeMarkers] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedGu, setSelectedGu] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    // 날짜 및 시간 형식을 변환하는 함수
    const formatFoundTime = (timestamp) => {
        const year = timestamp.slice(0, 2);
        const month = timestamp.slice(2, 4);
        const day = timestamp.slice(4, 6);
        const hour = timestamp.slice(6, 8);
        const minute = timestamp.slice(8, 10);

        return `20${year}/${month}/${day} ${hour}:${minute}`;
    };

    // 반원을 그리는 함수 --> CCTV가 촬영하는 범위를 표현
    const drawArc = (center, radius, startAngle, endAngle) => {
        const points = [];
        const angleStep = (endAngle - startAngle) / 100;

        for (let angle = startAngle; angle <= endAngle; angle += angleStep) {
            const radian = angle * (Math.PI / 180);
            const x = center.lng() + radius * Math.cos(radian) / 6378137 * (180 / Math.PI) / Math.cos(center.lat() * Math.PI / 180);
            const y = center.lat() + radius * Math.sin(radian) / 6378137 * (180 / Math.PI);
            points.push(new naver.maps.LatLng(y, x));
        }

        return points;
    };

    // CCTV가 감지한 유실물 데이터를 가져오는 함수
    useEffect(() => {
        const fetchCCTVData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "seoul-cctv"));
                const fetchedRows = await Promise.all(
                    querySnapshot.docs.map(async (doc) => {
                        const data = doc.data();
                        const bikeCollection = await getDocs(collection(db, `seoul-cctv/${doc.id}/missing-seoul-bike`));
                        const bikeData = bikeCollection.docs.map(bikeDoc => ({
                            ...bikeDoc.data(),
                            firstFoundTime: formatFoundTime(bikeDoc.data().firstFoundTime),
                            lastFoundTime: formatFoundTime(bikeDoc.data().lastFoundTime),
                            lat: bikeDoc.data().lat,
                            lon: bikeDoc.data().lon,
                            imageURL: bikeDoc.data().imageURL,
                            id: bikeDoc.id
                        }));
                        const address = await getReverseGeocoding(data.lat, data.lon);

                        // CCTV별 랜덤 방향 설정 (초기만 설정)
                        if (!cctvDirections[data.id]) {
                            cctvDirections[data.id] = Math.floor(Math.random() * 360);
                            saveCctvDirections(); // 로컬 스토리지에 저장
                        }

                        // 가장 최근에 발견된 따릉이의 최종 발견 시각
                        const lastFoundTime = bikeData.length > 0
                            ? bikeData.reduce((latest, bike) => (bike.lastFoundTime > latest ? bike.lastFoundTime : latest), bikeData[0].lastFoundTime)
                            : null;

                        return {
                            id: data.id,
                            cctvLat: data.lat,
                            cctvLon: data.lon,
                            imageURL: data.imageURL,
                            cctvAddress: address,
                            bikeData: bikeData,
                            foundLost: bikeData.length,
                            lastFoundTime: lastFoundTime,
                        };
                    })
                );

                setCctvRows(fetchedRows);
                setVisibleCctvRows(fetchedRows);
                filterParkOptions(fetchedRows);
            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };

        fetchCCTVData();
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

    // 유실 따릉이를 감지한 CCTV가 있는 공원 목록 필터링 함수
    const filterParkOptions = (cctvRows) => {
        const parksWithCCTV = [];

        cctvRows.forEach(cctv => {
            const associatedPark = ParkOptions.find(park => {
                const cctvLat = parseFloat(cctv.cctvLat);
                const cctvLon = parseFloat(cctv.cctvLon);
                const distance = calculateDistance(park.lat, park.lon, cctvLat, cctvLon);
                return distance <= 300; // 공원의 중심으로부터 1km 이내에 CCTV가 있는지 확인
            });

            if (associatedPark && !parksWithCCTV.includes(associatedPark)) {
                parksWithCCTV.push(associatedPark);
            }
        });

        setFilteredParkOptions(parksWithCCTV);
    };

    // 좌표 간의 거리를 계산하는 함수 (단위: 미터) - 하버사인 공식 사용
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const φ1 = lat1 * (Math.PI / 180);
        const φ2 = lat2 * (Math.PI / 180);
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
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

        currentMap.markers && currentMap.markers.forEach(marker => marker.setMap(null));
        currentMap.markers = [];

        filteredCCTV.forEach((row) => {
            const markerPosition = new naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));

            const marker = new naver.maps.Marker({
                position: markerPosition,
                map: currentMap,
                title: row.id,
            });

            currentMap.markers.push(marker);
        });

        setVisibleCctvRows(filteredCCTV);
    };

    // CCTV 목록에 있는 CCTV 데이터 클릭 시의 변화
    const handleObjectClick = (params) => {
        const row = visibleCctvRows.find(r => r.id === params.id);
        if (row) {
            const location = new naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));
            map.setCenter(location);
            map.setZoom(18);

            // 기존에 그려진 원과 마커가 있으면 제거
            if (circle) {
                circle.setMap(null);
            }
            bikeMarkers.forEach(marker => marker.setMap(null));

            // 각 CCTV에 대한 고정된 방향을 가져오기 (현재는 임의 변수로 설정되어 있음)
            const startAngle = cctvDirections[row.id];
            const endAngle = startAngle + 180; // 반원이므로 시작 각도 + 180도

            const radius = 50; // 반지름 (단위: 미터)

            // 반원 좌표 생성
            const arcPoints = drawArc(location, radius, startAngle, endAngle);

            // 반원을 그리는 폴리곤 생성 --> naver map API 활용
            const newCircle = new naver.maps.Polygon({
                map: map,
                paths: [location, ...arcPoints, location],
                strokeColor: '#5347AA',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#E5E5FF',
                fillOpacity: 0.5,
            });

            setCircle(newCircle);

            // 유실 따릉이 마커 추가
            const newBikeMarkers = row.bikeData.map(bike => {
                const isSingleDetection = bike.firstFoundTime === bike.lastFoundTime;
                const color = isSingleDetection ? 'yellow' : 'red';

                const bikeMarker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(parseFloat(bike.lat), parseFloat(bike.lon)),
                    map: map,
                    icon: {
                        content: `<div style="background-color:${color};width:10px;height:10px;border-radius:50%;"></div>`,
                        anchor: new naver.maps.Point(5, 5),
                    },
                    title: bike.id,
                });
                return bikeMarker;
            });

            setBikeMarkers(newBikeMarkers);
            setVisibleBikeRows(row.bikeData);

            setSelectedRow(row);
            setSelectedImage(row.bikeData.length > 0 ? row.bikeData[0].imageURL : row.imageURL);
            setDrawerOpen(true);
        }
    };

    // Drawer 내 유실물 클릭 시의 변화 (이미지 변경)
    const handleBikeRowClick = (params) => {
        const bike = visibleBikeRows.find(b => b.id === params.id);
        if (bike) {
            setSelectedImage(bike.imageURL);
        }
    };

    // Option에 있는 공원 목록 선택 시 변화
    const handleGuChange = (event) => {
        setSelectedGu(event.target.value);

        if (event.target.value === "") {
            const seoulCenter = new naver.maps.LatLng(37.5505, 126.9780);
            map.setCenter(seoulCenter);
            map.setZoom(12);
            setVisibleCctvRows(cctvRows);
            return;
        }

        const selectedPark = filteredParkOptions.find(park => park.name === event.target.value);
        if (selectedPark && map) {
            const parkLocation = new naver.maps.LatLng(selectedPark.lat, selectedPark.lon);
            map.setCenter(parkLocation);
            map.setZoom(17);

            updateVisibleMarkers(map);
        }
    };

    // 이미지 클릭 시 모달 창 열기 (확대)
    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setModalOpen(true);
    };

    // Drawer 창이 닫힐 때 유실 따릉이 마커와 원 삭제
    const handleCloseDrawer = () => {
        bikeMarkers.forEach(marker => marker.setMap(null));
        setBikeMarkers([]);
        if (circle) {
            circle.setMap(null);
        }
        setCircle(null);
        setDrawerOpen(false);
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
                    {filteredParkOptions.map(park => (
                        <option key={park.name} value={park.name}>{park.name}</option>
                    ))}
                </select>
            </div>
            <div ref={mapElement} className='map-naver-view'></div>
            <Box>
                <DataGrid
                    rows={visibleCctvRows}
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
                onClose={handleCloseDrawer}
            >
                {selectedRow && (
                    <Box p={2} width="500px" textAlign="center">
                        <Button onClick={handleCloseDrawer} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
                            닫기
                        </Button>
                        <h2>{selectedRow.id}</h2>
                        <img
                            src={selectedImage}
                            alt="CCTV Image"
                            style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                            onClick={() => handleImageClick(selectedImage)}
                        />
                        <p>{selectedRow.cctvAddress}</p>
                        <p>해당 CCTV가 보여주는 따릉이 정보</p>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={visibleBikeRows}
                                columns={columns_Lost}
                                onCellClick={handleBikeRowClick}
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