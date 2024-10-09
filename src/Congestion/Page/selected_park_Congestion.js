import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import parkData from "../../parkList.json"; // 공원 데이터
import ImageModal from "../../utils/ImageModal";
import NaverMap from "../../utils/NaverMap";
import '../../App.css';
import HeaderPage_Congestion_selected from "../Components/HeaderPage_Congestion_selected";
import CCTVDrawer_Congestion from "../Components/Drawer_Congestion";
import CctvTable_Congestion from "../Components/cctvTable_Congestion";

// CCTV 방향 저장 객체 (로컬 스토리지에서 불러오기)
const getCctvDirections = () => {
    const storedDirections = localStorage.getItem('cctvDirections');
    return storedDirections ? JSON.parse(storedDirections) : {};
};

const cctvDirections = getCctvDirections();

const saveCctvDirections = () => {
    localStorage.setItem('cctvDirections', JSON.stringify(cctvDirections));
};

const Selected_park_Congestion = () => {
    const { parkName } = useParams(); // URL에서 공원명 가져오기
    const mapElement = useRef(null);
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [cctvRows, setCctvRows] = useState([]);
    const [visibleCctvRows, setVisibleCctvRows] = useState([]);
    const [map, setMap] = useState(null);
    const [circle, setCircle] = useState(null);  // CCTV 범위를 저장할 변수
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [filteredParkOptions, setFilteredParkOptions] = useState([]); // 필터링된 공원 목록
    const [currentAngle, setCurrentAngle] = useState(cctvDirections); // 각도 상태 관리를 위한 변수
    const [pageSize, setPageSize] = useState(10);
    const [selectedCctvLocation, setSelectedCctvLocation] = useState(null);
    const [allParkOptions, setAllParkOptions] = useState([]);

    // 부채꼴을 그리는 함수
    // const drawArc = (center, radius, startAngle, endAngle) => {
    //     const points = [];
    //     const angleStep = (endAngle - startAngle) / 100;
    //
    //     for (let angle = startAngle; angle <= endAngle; angle += angleStep) {
    //         const radian = angle * (Math.PI / 180);
    //         const x = center.lng() + radius * Math.cos(radian) / 6378137 * (180 / Math.PI) / Math.cos(center.lat() * Math.PI / 180);
    //         const y = center.lat() + radius * Math.sin(radian) / 6378137 * (180 / Math.PI);
    //         points.push(new window.naver.maps.LatLng(y, x));
    //     }
    //
    //     return points;
    // };

    useEffect(() => {
        // parkData.json에서 모든 공원 목록을 설정
        setAllParkOptions(parkData.DATA);
    }, []);

    // CCTV 데이터 불러오기
    useEffect(() => {
        const fetchCCTVData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "seoul-cctv"));
                const fetchedRows = await Promise.all(
                    querySnapshot.docs.map(async (doc) => {
                        const data = doc.data();
                        const congCollection = await getDocs(collection(db, `seoul-cctv/${doc.id}/people-congestion`));

                        let averagePeopleCount = 0;
                        let congestionLevel = "원활"; // 기본값을 '원활'로 설정

                        if (!congCollection.empty) {
                            // 가장 최근 문서 찾기
                            const latestCongDoc = congCollection.docs[congCollection.docs.length - 1]; // 가장 마지막 문서가 가장 최근
                            averagePeopleCount = parseFloat(latestCongDoc.data().average_people_count); // average_people_count 사용

                            // 혼잡도 계산: average_people_count 값에 따라 변경
                            if (averagePeopleCount >= 25) {
                                congestionLevel = "혼잡";
                            } else if (averagePeopleCount >= 10) {
                                congestionLevel = "보통";
                            }
                        }

                        const address = await getReverseGeocoding(data.lat, data.lon);

                        // CCTV별 랜덤 방향 설정 (초기만 설정)
                        if (!cctvDirections[data.id]) {
                            cctvDirections[data.id] = Math.floor(Math.random() * 360);
                            saveCctvDirections(); // 로컬 스토리지에 저장
                        }

                        const fixed = data.fixed || false;

                        return {
                            id: data.id,
                            cctvLat: data.lat,
                            cctvLon: data.lon,
                            imageURL: data.imageURL,
                            cctvAddress: address,
                            fixed: fixed,
                            congStreamURL: data.conStreamURL,
                            averagePeopleCount: averagePeopleCount,  // 추가: 감지된 사람 수
                            congestionLevel: congestionLevel // 추가: 계산된 혼잡도
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
                        parseFloat(selectedPark.latitude),
                        parseFloat(selectedPark.longitude),
                        parseFloat(cctv.cctvLat),
                        parseFloat(cctv.cctvLon)
                    );
                    return distance <= 300; // 300m 이내의 CCTV
                });

                setCctvRows(filteredCCTV);
                setVisibleCctvRows(filteredCCTV);

                if (fetchedRows.length < 10) {
                    setPageSize(fetchedRows.length);  // rows 개수에 맞춰 pageSize 설정
                }

            } catch (error) {
                console.error("Error fetching data from Firestore:", error);
            }
        };
        fetchCCTVData();
    }, [parkName]);



    useEffect(() => {
        const updateAngle = () => {
            setCurrentAngle((prevAngles) => {
                const updatedAngles = { ...prevAngles };
                Object.keys(updatedAngles).forEach((id) => {
                    const cctv = cctvRows.find(cctv => cctv.id === id);
                    if (cctv && !cctv.fixed) { // 회전형 CCTV일 때만 회전
                        updatedAngles[id] += 5;
                        if (updatedAngles[id] >= 180 || updatedAngles[id] <= 0) {
                            updatedAngles[id] *= -1; // 각도가 0~180 범위를 넘어가면 방향 반전
                        }
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

                // 마커 추가
                new window.naver.maps.Marker({
                    position: markerPosition,
                    map: newMap,
                    title: row.id,
                });
            });
        }
    }, [cctvRows, parkName]);

    // CCTV 목록에 있는 CCTV 데이터 클릭 시 Drawer 열리고, 부채꼴 표시
    const handleObjectClick = (params) => {
        const row = visibleCctvRows.find(r => r.id === params.id);
        if (row) {
            const location = new window.naver.maps.LatLng(parseFloat(row.cctvLat), parseFloat(row.cctvLon));
            map.setCenter(location);
            map.setZoom(18);

            // if (circle) {
            //     circle.setMap(null);
            // }
            //
            // const startAngle = currentAngle[row.id];
            // const endAngle = row.fixed ? startAngle + 66 : startAngle + 180;
            // const radius = 50;

            // const arcPoints = drawArc(location, radius, startAngle, endAngle);

            // const newCircle = new window.naver.maps.Polygon({
            //     map: map,
            //     paths: [location, ...arcPoints, location],
            //     strokeColor: '#5347AA',
            //     strokeOpacity: 0.8,
            //     strokeWeight: 2,
            //     fillColor: '#E5E5FF',
            //     fillOpacity: 0.5,
            // });
            //
            // setCircle(newCircle);

            setSelectedRow(row);
            setSelectedImage(row.imageURL);
            setDrawerOpen(true);
        }
    };

    const handleParkChange = (event) => {   // 우측 상단 리스트에 존재하는 공원으로 클릭 시 이동
        const selectedParkName = event.target.value;
        if (selectedParkName) {
            navigate(`/park-congestion/${encodeURIComponent(selectedParkName)}`);
        }
    };

    const handleTitleClick = () => {    // 메인 페이지로 이동
        navigate("/park-congestion");
    };

    const handleCloseDrawer = () => {
        if (circle) {
            circle.setMap(null);
        }
        setCircle(null);
        setDrawerOpen(false);
    };

    return (
        <div className={`main-content ${drawerOpen ? 'drawer-open' : ''}`}> {/* Drawer가 열리면 화면이 밀림 */}
            <HeaderPage_Congestion_selected
                parkName={parkName}
                filteredParkOptions={allParkOptions}
                onParkChange={handleParkChange}
                onTitleClick={handleTitleClick}
            />
            <NaverMap
                cctvRows={visibleCctvRows}
                mapElementRef={mapElement}
                selectedCctvLocation={selectedCctvLocation}
            />
            <Box className="data-grid">
                <CctvTable_Congestion
                    rows={visibleCctvRows}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    onRowClick={handleObjectClick}
                />
            </Box>
            <CCTVDrawer_Congestion
                open={drawerOpen}
                selectedRow={selectedRow}
                selectedImage={selectedImage}
                onClose={handleCloseDrawer}
            />
            <ImageModal
                open={modalOpen}
                imageURL={selectedImage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default Selected_park_Congestion;
