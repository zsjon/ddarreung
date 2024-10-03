// import React, { useEffect, useState } from 'react';
// import Box from '@mui/material/Box';
// import { DataGrid } from '@mui/x-data-grid';
// import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { columns_Park } from "../columns/columns_Park";
// import parkData from "../parkList.json"; // 공원 데이터
//
// const MainPage_park = () => {
//     const [cctvRows, setCctvRows] = useState([]);
//     const [filteredParkRows, setFilteredParkRows] = useState([]);
//     const navigate = useNavigate(); // useNavigate 초기화
//
//     // 날짜 및 시간 형식을 변환하는 함수
//     const formatFoundTime = (timestamp) => {
//         const year = timestamp.slice(0, 2);
//         const month = timestamp.slice(2, 4);
//         const day = timestamp.slice(4, 6);
//         const hour = timestamp.slice(6, 8);
//         const minute = timestamp.slice(8, 10);
//         return `20${year}/${month}/${day} ${hour}:${minute}`;
//     };
//
//     // CCTV 데이터를 불러오는 함수
//     useEffect(() => {
//         const fetchCCTVData = async () => {
//             try {
//                 const querySnapshot = await getDocs(collection(db, "seoul-cctv"));
//                 const fetchedRows = await Promise.all(
//                     querySnapshot.docs.map(async (doc) => {
//                         const data = doc.data();
//                         const bikeCollection = await getDocs(collection(db, `seoul-cctv/${doc.id}/missing-seoul-bike`));
//                         const bikeData = bikeCollection.docs.map(bikeDoc => ({
//                             ...bikeDoc.data(),
//                             firstFoundTime: formatFoundTime(bikeDoc.data().firstFoundTime),
//                             lastFoundTime: formatFoundTime(bikeDoc.data().lastFoundTime),
//                         }));
//                         return {
//                             ...data,
//                             bikeData: bikeData, // 유실물 정보 포함
//                         };
//                     })
//                 );
//                 setCctvRows(fetchedRows);
//             } catch (error) {
//                 console.error("Error fetching data from Firestore:", error);
//             }
//         };
//         fetchCCTVData();
//     }, []);
//
//     // 공원 데이터와 CCTV 데이터를 매칭하고 모든 공원을 표시하는 함수
//     useEffect(() => {
//         // 필터링하지 않고 모든 공원을 표시하고, CCTV 수가 많은 순으로 정렬
//         const parksWithCCTV = parkData.DATA.map((park) => {
//             const matchingCCTVs = cctvRows.filter(cctv => {
//                 const distance = calculateDistance(
//                     parseFloat(park.latitude), parseFloat(park.longitude),
//                     parseFloat(cctv.lat), parseFloat(cctv.lon)
//                 );
//                 return distance <= 300 && cctv.bikeData.length > 0;
//             });
//
//             return {
//                 ...park,
//                 cctvCount: matchingCCTVs.length // 유실물을 감지한 CCTV 대수를 추가
//             };
//         });
//
//         // cctvCount 기준으로 내림차순 정렬
//         const sortedParks = parksWithCCTV.sort((a, b) => b.cctvCount - a.cctvCount);
//
//         setFilteredParkRows(sortedParks);
//     }, [cctvRows]);
//
//     // 좌표 간의 거리를 계산하는 함수 (단위: 미터)
//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371e3;
//         const φ1 = lat1 * (Math.PI / 180);
//         const φ2 = lat2 * (Math.PI / 180);
//         const Δφ = (lat2 - lat1) * (Math.PI / 180);
//         const Δλ = (lon2 - lon1) * (Math.PI / 180);
//         const a =
//             Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//             Math.cos(φ1) * Math.cos(φ2) *
//             Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         return R * c;
//     };
//
//     // 공원명을 클릭했을 때 해당 공원의 상세 페이지로 이동하는 함수
//     const handleParkNameClick = (params) => {
//         if (params.field === 'p_park') {
//             const parkName = params.row.p_park;
//             navigate(`/park/${encodeURIComponent(parkName)}`); // 공원 이름을 URL에 포함하여 이동
//         }
//     };
//
//     return (
//         <React.Fragment>
//             <div className='header-website'>
//                 <h1 className='main-title-website'>공원 목록 (CCTV 수가 많은 순)</h1>
//             </div>
//             <Box>
//                 <DataGrid
//                     rows={filteredParkRows} // 모든 공원을 출력
//                     columns={columns_Park}
//                     getRowId={(row) => row.p_idx}
//                     pageSizeOptions={[10, 50, 100]}
//                     pagination
//                     disableRowSelectionOnClick
//                     initialState={{ // 페이지 크기 초기값 설정
//                         pagination: { paginationModel: { pageSize: 10 } }
//                     }}
//                     onCellClick={handleParkNameClick} // 공원명 클릭 시 라우팅
//                 />
//             </Box>
//         </React.Fragment>
//     );
// };
//
// export default MainPage_park;


import React, { useEffect, useState } from 'react';
import { fetchCCTVData } from '../utils/fetchCCTVData'; // CCTV 데이터를 가져오는 함수
import { calculateDistance } from '../utils/calculateDistance'; // 거리 계산 유틸리티 함수
import parkData from "../parkList.json"; // 공원 데이터
import ParkListTable from '../Components/parkListTable'; // 공원 리스트 테이블

const MainPage_park = () => {
    const [cctvRows, setCctvRows] = useState([]);
    const [filteredParkRows, setFilteredParkRows] = useState([]);

    // 날짜 및 시간 형식을 변환하는 함수
    const formatFoundTime = (timestamp) => {
        const year = timestamp.slice(0, 2);
        const month = timestamp.slice(2, 4);
        const day = timestamp.slice(4, 6);
        const hour = timestamp.slice(6, 8);
        const minute = timestamp.slice(8, 10);
        return `20${year}/${month}/${day} ${hour}:${minute}`;
    };

    // CCTV 데이터를 불러오는 함수
    useEffect(() => {
        const fetchData = async () => {
            const fetchedCCTVData = await fetchCCTVData(); // 전체 CCTV 데이터를 가져옴
            setCctvRows(fetchedCCTVData);
        };

        fetchData();
    }, []);

    // 공원 데이터와 CCTV 데이터를 매칭하고 모든 공원을 표시하는 함수
    useEffect(() => {
        // 필터링하지 않고 모든 공원을 표시하고, CCTV 수가 많은 순으로 정렬
        const parksWithCCTV = parkData.DATA.map((park) => {
            const matchingCCTVs = cctvRows.filter(cctv => {
                const distance = calculateDistance(
                    parseFloat(park.latitude), parseFloat(park.longitude),
                    parseFloat(cctv.lat), parseFloat(cctv.lon)
                );
                return distance <= 300 && cctv.bikeData.length > 0;
            });

            return {
                ...park,
                cctvCount: matchingCCTVs.length // 유실물을 감지한 CCTV 대수를 추가
            };
        });

        // cctvCount 기준으로 내림차순 정렬
        const sortedParks = parksWithCCTV.sort((a, b) => b.cctvCount - a.cctvCount);
        setFilteredParkRows(sortedParks);
    }, [cctvRows]);

    return (
        <React.Fragment>
            <div className='header-website'>
                <h1 className='main-title-website'>공원 목록 (CCTV 수가 많은 순)</h1>
            </div>
            <ParkListTable filteredParkRows={filteredParkRows} /> {/* 공원 리스트 컴포넌트 */}
        </React.Fragment>
    );
};

export default MainPage_park;
