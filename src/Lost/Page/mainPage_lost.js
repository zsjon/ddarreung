import React, { useEffect, useState } from 'react';
import { fetchCCTVData } from '../../utils/fetchCCTVData'; // CCTV 데이터를 가져오는 함수
import { calculateDistance } from '../../utils/calculateDistance'; // 거리 계산 유틸리티 함수
import parkData from "../../parkList.json"; // 공원 데이터
import ParkListTable_Lost from '../Components/parkListTable_Lost';
import HeaderPage_Lost_main from "../Components/HeaderPage_Lost_main";
import {useNavigate} from "react-router-dom"; // 공원 리스트 테이블

const MainPage_lost = () => {
    const [cctvRows, setCctvRows] = useState([]);
    const [filteredParkRows, setFilteredParkRows] = useState([]);
    const navigate = useNavigate();

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

    const handleTitleClick = () => {    // 메인 페이지로 이동
        navigate("/");
    };

    return (
        <React.Fragment>
            <HeaderPage_Lost_main onTitleClick={handleTitleClick}/>
            <ParkListTable_Lost filteredParkRows={filteredParkRows} /> {/* 공원 리스트 컴포넌트 */}
        </React.Fragment>
    );
};

export default MainPage_lost;
