import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../utils/firebase'; // Firebase 연결 파일
import { calculateDistance } from '../../utils/calculateDistance'; // 거리 계산 유틸리티 함수
import parkData from "../../parkList.json"; // 공원 데이터
import ParkListTable_Congestion from '../Components/parkListTable_Congestion'; // 공원 리스트 테이블

const MainPage_congestion = () => {
    const [cctvRows, setCctvRows] = useState([]);
    const [filteredParkRows, setFilteredParkRows] = useState([]);

    // CCTV 데이터를 불러오는 함수
    const fetchCCTVData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "seoul-cctv"));
            const fetchedRows = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const congCollection = await getDocs(collection(db, `seoul-cctv/${doc.id}/people-congestion`));
                    let pplCnt = 0;
                    let congestionLevel = "원활"; // 기본값을 '원활'로 설정

                    if (!congCollection.empty) {
                        const latestCongDoc = congCollection.docs[0]; // 가장 최근의 혼잡도 문서
                        pplCnt = parseInt(latestCongDoc.data().pplCnt, 10);

                        // 혼잡도 계산
                        if (pplCnt >= 10) {
                            congestionLevel = "혼잡";
                        } else if (pplCnt >= 5) {
                            congestionLevel = "보통";
                        }
                    }

                    return {
                        id: data.id,
                        cctvLat: data.lat,
                        cctvLon: data.lon,
                        pplCnt: pplCnt, // 추가: 감지된 사람 수
                        congestionLevel: congestionLevel // 추가: 계산된 혼잡도
                    };
                })
            );
            setCctvRows(fetchedRows); // CCTV 데이터를 상태로 저장
        } catch (error) {
            console.error("Error fetching CCTV data: ", error);
        }
    };

    // 공원 데이터와 CCTV 데이터를 매칭하고 모든 공원을 표시하는 함수
    useEffect(() => {
        const fetchData = async () => {
            await fetchCCTVData();

            const parksWithCCTV = parkData.DATA.map((park) => {
                const matchingCCTVs = cctvRows.filter(cctv => {
                    const distance = calculateDistance(
                        parseFloat(park.latitude),
                        parseFloat(park.longitude),
                        parseFloat(cctv.cctvLat),
                        parseFloat(cctv.cctvLon)
                    );
                    return distance <= 300; // 300m 이내의 CCTV만 포함
                });

                // 공원에서 가장 높은 혼잡도를 적용
                const maxCongestionLevel = matchingCCTVs.reduce((maxLevel, cctv) => {
                    return (maxLevel === '혼잡' || cctv.congestionLevel === '혼잡') ? '혼잡' :
                        (maxLevel === '보통' || cctv.congestionLevel === '보통') ? '보통' : '원활';
                }, '원활');

                return {
                    ...park,
                    congestionLevel: maxCongestionLevel // 공원의 최종 혼잡도
                };
            });

            // 공원 ID 기준으로 오름차순 정렬
            const sortedParks = parksWithCCTV.sort((a, b) => a.p_idx - b.p_idx);
            setFilteredParkRows(sortedParks);
        };

        fetchData();
    }, [cctvRows]); // CCTV 데이터가 변경될 때마다 실행

    return (
        <React.Fragment>
            <div className='header-website'>
                <h1 className='main-title-website'>공원 목록 (혼잡도 순)</h1>
            </div>
            <ParkListTable_Congestion filteredParkRows={filteredParkRows} /> {/* 공원 리스트 컴포넌트 */}
        </React.Fragment>
    );
};

export default MainPage_congestion;
