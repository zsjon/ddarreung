import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Drawer, Modal, Button } from "@mui/material";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { columns_CCTV } from "./columns/columns_CCTV";
import { columns_Lost } from "./columns/columns_Lost";
import parkData from "./parkList.json"; // 공원 데이터
import { IoListOutline } from "react-icons/io5"; // 아이콘 

// CCTV 방향 저장 객체 (로컬 스토리지에서 불러오기)
const getCctvDirections = () => {
    const storedDirections = localStorage.getItem('cctvDirections');
    return storedDirections ? JSON.parse(storedDirections) : {};
};

const cctvDirections = getCctvDirections();

const saveCctvDirections = () => {
    localStorage.setItem('cctvDirections', JSON.stringify(cctvDirections));
};

const Selected_park = () => {
    const { parkName } = useParams(); // URL에서 공원명 가져오기
    const mapElement = useRef(null);
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [cctvRows, setCctvRows] = useState([]);
    const [visibleCctvRows, setVisibleCctvRows] = useState([]);
    const [map, setMap] = useState(null);
    const [circle, setCircle] = useState(null);
    const [bikeMarkers, setBikeMarkers] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [filteredParkOptions, setFilteredParkOptions] = useState([]); // 필터링된 공원 목록
    const [visibleBikeRows, setVisibleBikeRows] = useState([]);
    const [currentAngle, setCurrentAngle] = useState(cctvDirections); // 각도 상태 관리를 위한 변수
    const [pageSize, setPageSize] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);   // modal에서 선택된 데이터 삭제를 위한 변수
    const [suspiciousItemCount,setSuspiciousItemCount] = useState(0);
    const [lostItemCount,setLostItemCount] = useState(0);

    // 날짜 및 시간 형식을 변환하는 함수
    const formatFoundTime = (timestamp) => {
        const year = timestamp.slice(0, 2);
        const month = timestamp.slice(2, 4);
        const day = timestamp.slice(4, 6);
        const hour = timestamp.slice(6, 8);
        const minute = timestamp.slice(8, 10);
        return `20${year}/${month}/${day} ${hour}:${minute}`;
    };

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

    // CCTV 데이터 불러오기
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

                const selectedPark = parkData.DATA.find(park => park.p_park === parkName);
                if (!selectedPark) {
                    console.error("선택된 공원을 찾을 수 없습니다.");
                    return;
                }

                const filteredCCTV = fetchedRows.filter(cctv => {
                    const distance = calculateDistance(
                        parseFloat(selectedPark.latitude), parseFloat(selectedPark.longitude),
                        parseFloat(cctv.cctvLat), parseFloat(cctv.cctvLon)
                    );
                    return distance <= 300 && cctv.bikeData.length > 0; // 300m 이내의 CCTV
                });

                setCctvRows(filteredCCTV);
                setVisibleCctvRows(filteredCCTV);

                if (fetchedRows.length < 10) {
                    setPageSize(fetchedRows.length);  // rows 개수에 맞춰 pageSize 설정
                }

                const parksWithCCTV = parkData.DATA.filter((park) => {
                    const hasMatchingCCTV = fetchedRows.some(cctv => {
                        const distance = calculateDistance(
                            parseFloat(park.latitude), parseFloat(park.longitude),
                            parseFloat(cctv.cctvLat), parseFloat(cctv.cctvLon)
                        );
                        return distance <= 300 && cctv.bikeData.length > 0;
                    });
                    return hasMatchingCCTV;
                });

                setFilteredParkOptions(parksWithCCTV); // 유실물이 발견된 공원만 설정

            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };
        fetchCCTVData();
    }, [parkName]);

    const handleDeleteRow = async (rowId) => {
        try {
            // Firestore에서 데이터 삭제
            await deleteDoc(doc(db, `seoul-cctv/${selectedRow.id}/missing-seoul-bike/${rowId}`));

            // DataGrid의 visibleBikeRows 상태를 업데이트하여 즉시 반영
            setVisibleBikeRows((prevRows) => prevRows.filter((row) => row.id !== rowId));

            // 선택된 행 초기화 (필요시)
            setSelectedRows([]);

            alert("삭제가 완료되었습니다.");
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        let direction = 1; // 회전 방향 (1은 시계방향, -1은 반시계방향)

        const updateAngle = () => {
            setCurrentAngle((prevAngles) => {
                const updatedAngles = { ...prevAngles };
                Object.keys(updatedAngles).forEach((id) => {
                    updatedAngles[id] += 5 * direction;
                    if (updatedAngles[id] >= 180 || updatedAngles[id] <= 0) {
                        direction *= -1; // 각도가 0~180 범위를 넘어가면 방향 반전
                    }
                });
                saveCctvDirections();
                return updatedAngles;
            });
        };

        const intervalId = setInterval(updateAngle, 3000); // 3초마다 5도씩 회전
        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 클리어
    }, []);

    const getReverseGeocoding = (latitude, longitude) => {
        return new Promise((resolve, reject) => {
            window.naver.maps.Service.reverseGeocode({
                coords: new window.naver.maps.LatLng(latitude, longitude),
                orders: [
                    window.naver.maps.Service.OrderType.ADDR,
                    window.naver.maps.Service.OrderType.ROAD_ADDR
                ].join(',')
            }, function(status, response) {
                if (status === window.naver.maps.Service.Status.ERROR) {
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
        return R * c;
    };

    useEffect(() => {
        if (!mapElement.current || !window.naver) return;

        const selectedPark = parkData.DATA.find(park => park.p_park === parkName);
        if (!selectedPark) return;

        const location = new window.naver.maps.LatLng(parseFloat(selectedPark.latitude), parseFloat(selectedPark.longitude));
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
        };

        const newMap = new window.naver.maps.Map(mapElement.current, mapOptions);
        setMap(newMap);

        if (cctvRows.length > 0) {
            cctvRows.forEach((row) => {
                const markerPosition = new window.naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));

                new window.naver.maps.Marker({
                    position: markerPosition,
                    map: newMap,
                    title: row.id,
                });
            });
        }
    }, [cctvRows, parkName]);

    // 공원에 존재하는 마커 모든 마커 표시
    // 모든 따릉이 데이터를 지도에 표시하는 함수
    const allMakerDisplay = () => {
        if (!map || visibleCctvRows.length === 0) return; // 지도와 CCTV 데이터가 있을 때만 실행
    
        // 기존 마커 제거
        bikeMarkers.forEach(marker => marker.setMap(null));
        setBikeMarkers([]); // 마커 상태 초기화
    
        const newBikeMarkers = [];
    
        visibleCctvRows.forEach((cctvRow) => {
            cctvRow.bikeData.forEach((bike) => {
                const isSingleDetection = bike.firstFoundTime === bike.lastFoundTime;
                const color = isSingleDetection ? 'yellow' : 'red';
    
                const bikeMarker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(parseFloat(bike.lat), parseFloat(bike.lon)),
                    map: map, // 지도에 마커 추가
                    color : color,
                    icon: {
                        content: `<div style="background-color:${color};width:10px;height:10px;border-radius:50%;"></div>`,
                        anchor: new window.naver.maps.Point(5, 5),
                    },
                    title: bike.id, // 마커의 ID
                });
    
                newBikeMarkers.push(bikeMarker);
            });
        });
    
        setBikeMarkers(newBikeMarkers); // 생성된 마커 상태에 저장
    };
    

    useEffect(() => {
        if (visibleCctvRows.length > 0) {
            allMakerDisplay(); // visibleCctvRows가 업데이트될 때마다 마커를 다시 그림
        }
    }, [visibleCctvRows, map]);
    
    // 유실물들의 수를 세는 함수, 의심, 분실 두 종류의 분실물들의 수를 업데이트 함.
    const itemCount = (bikeMarkers) => {
        let suspiciousCount = 0;
        let lostCount = 0;
    
        bikeMarkers.forEach((eachBikeMarker) => {
            const color = eachBikeMarker.icon.content.includes('yellow') ? 'yellow' : 'red'; // 마커의 색상 확인
    
            if (color === "yellow") {
                suspiciousCount++;
            } else if (color === "red") {
                lostCount++;
            }
        });
    
        setSuspiciousItemCount(suspiciousCount); // 카운트 업데이트
        setLostItemCount(lostCount);
    };

    
    // bikeMarkers가 업데이트된 후에 유실물 개수를 카운트
    useEffect(() => {
        if (bikeMarkers.length > 0) {
            itemCount(bikeMarkers); 
        }
    }, [bikeMarkers]); // bikeMarkers가 변경될 때마다 실행
    

    // CCTV 목록에 있는 CCTV 데이터 클릭 시의 변화
    const handleObjectClick = (params) => {
        const row = visibleCctvRows.find(r => r.id === params.id);
        if (row) {
            const location = new window.naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));
            map.setCenter(location);
            map.setZoom(18);

            if (circle) {
                circle.setMap(null);
            }
            bikeMarkers.forEach(marker => marker.setMap(null));

            const startAngle = currentAngle[row.id];
            const endAngle = startAngle + 180;

            const radius = 50;

            const arcPoints = drawArc(location, radius, startAngle, endAngle);

            const newCircle = new window.naver.maps.Polygon({
                map: map,
                paths: [location, ...arcPoints, location],
                strokeColor: '#5347AA',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#E5E5FF',
                fillOpacity: 0.5,
            });

            setCircle(newCircle);

            const newBikeMarkers = row.bikeData.map(bike => {
                const isSingleDetection = bike.firstFoundTime === bike.lastFoundTime;
                const color = isSingleDetection ? 'yellow' : 'red';

                const bikeMarker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(parseFloat(bike.lat), parseFloat(bike.lon)),
                    map: map,
                    icon: {
                        content: `<div style="background-color:${color};width:10px;height:10px;border-radius:50%;"></div>`,
                        anchor: new window.naver.maps.Point(5, 5),
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

    const handleParkChange = (event) => {   // 우측 상단 리스트에 존재하는 공원으로 클릭 시 이동
        const selectedParkName = event.target.value;
        if (selectedParkName) {
            navigate(`/park/${encodeURIComponent(selectedParkName)}`);
        }
    };

    const handleTitleClick = () => {    // 메인 페이지로 이동
        navigate("/");
    };

    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setModalOpen(true);
    };

    const handleBikeRowClick = (params) => {
        const bike = visibleBikeRows.find(b => b.id === params.id);
        if (bike) {
            setSelectedImage(bike.imageURL);
        }
    };

    const handleCloseDrawer = () => {
        bikeMarkers.forEach(marker => marker.setMap(null));
        setBikeMarkers([]);
        if (circle) {
            circle.setMap(null);
        }
        setCircle(null);
        setDrawerOpen(false);
        allMakerDisplay();
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedImage('');
    };

    return (
        <React.Fragment>
            <div className='header-website'>
                <button className='to-main-menu' onClick={handleTitleClick} style={{ cursor: 'pointer' }}><IoListOutline size="48"/></button>
                <h1 className='title-website' onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                    {parkName} 유실물 현황
                </h1>
                <h1 className='lost-item-count'>
                    의심:{suspiciousItemCount} 분실:{lostItemCount}
                </h1>
                <select className='button' onChange={handleParkChange} value={parkName}>
                    <option value="">공원 선택</option>
                    {filteredParkOptions.map(park => (
                        <option key={park.p_park} value={park.p_park}>{park.p_park}</option>
                    ))}
                </select>
            </div>
            <div ref={mapElement} className='map-naver-view'></div>
            <Box>
                <DataGrid
                    rows={visibleCctvRows}
                    columns={columns_CCTV}
                    onCellClick={handleObjectClick}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    rowsPerPageOptions={[10, 50, 100]}
                    pagination
                    // initialState={{
                    //     pagination: { paginationModel: { pageSize: 10 } }
                    // }}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                />
            </Box>

            {/* Drawer for detailed view */}
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
                                columns={columns_Lost(handleDeleteRow)} // Pass handleDeleteRow to columns_Lost
                                getRowId={(row) => row.id}
                                disableRowSelectionOnClick
                                pageSize={pageSize}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                rowsPerPageOptions={[10, 50, 100]}
                                onSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
                                selectionModel={selectedRows}
                            />
                        </Box>
                    </Box>

                )}
            </Drawer>

            {/* Modal for enlarged image */}
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

export default Selected_park;