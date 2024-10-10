import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { collection, onSnapshot } from "firebase/firestore"; // onSnapshot 사용
import { db } from "./firebase";
import Toggle from "./Toggle";


// Chart.js에 필요한 스케일과 플러그인 등록
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartData = ({ cctvId }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [isRealTime, setIsRealTime] = useState(true);  // 토글 상태 (실시간/시간별 트렌드)

    const MAX_X_VALUES = 12; // x축 최대 표시할 데이터 개수

    // 실시간 데이터를 처리하는 함수
    const processRealTimeData = (querySnapshot) => {
        const labels = [];
        const data = [];

        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const averagePeopleCount = Math.floor(docData.average_people_count);

            const timestamp = docData.timestamp;
            const formattedTimestamp = `${timestamp.slice(0, 2)}/${timestamp.slice(2, 4)}/${timestamp.slice(4, 6)} ${timestamp.slice(6, 8)}:${timestamp.slice(8, 10)}:${timestamp.slice(10, 12)}`;

            labels.push(formattedTimestamp);
            data.push(averagePeopleCount);
        });

        // 새 데이터를 x축에 12개로 제한
        const limitedLabels = labels.slice(-MAX_X_VALUES);
        const limitedData = data.slice(-MAX_X_VALUES);

        setChartData({
            labels: limitedLabels,
            datasets: [
                {
                    label: "Average People Count",
                    data: limitedData,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)"
                }
            ]
        });
    };

    // 분 단위 데이터를 처리하는 함수
    const processMinuteTrendData = (querySnapshot) => {
        const minuteData = {};

        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const averagePeopleCount = Math.floor(docData.average_people_count);

            const timestamp = docData.timestamp;
            const minuteKey = timestamp.slice(0, 8); // 연/월/일/시/분 단위로 키 생성

            if (!minuteData[minuteKey]) {
                minuteData[minuteKey] = { total: 0, count: 0 };
            }

            minuteData[minuteKey].total += averagePeopleCount;
            minuteData[minuteKey].count += 1;
        });

        const labels = [];
        const data = [];

        Object.keys(minuteData).forEach(minuteKey => {
            const average = minuteData[minuteKey].total / minuteData[minuteKey].count;

            const formattedMinute = `${minuteKey.slice(0, 2)}/${minuteKey.slice(2, 4)}/${minuteKey.slice(4, 6)} ${minuteKey.slice(6, 8)}:00`;

            labels.push(formattedMinute);
            data.push(average);
        });

        // 새 데이터를 x축에 12개로 제한
        const limitedLabels = labels.slice(-MAX_X_VALUES);
        const limitedData = data.slice(-MAX_X_VALUES);

        setChartData({
            labels: limitedLabels,
            datasets: [
                {
                    label: "Minute Average People Count",
                    data: limitedData,
                    fill: true,
                    backgroundColor: "rgba(192, 75, 192, 0.2)",
                    borderColor: "rgba(192, 75, 192, 1)"
                }
            ]
        });
    };

    useEffect(() => {
        if (!cctvId) return;

        const unsubscribe = onSnapshot(
            collection(db, `seoul-cctv/${cctvId}/people-congestion`),
            (querySnapshot) => {
                if (isRealTime) {
                    processRealTimeData(querySnapshot); // 실시간 데이터 처리
                } else {
                    processMinuteTrendData(querySnapshot); // 시간별 트렌드 데이터 처리
                }
            }
        );

        return () => unsubscribe(); // 컴포넌트가 언마운트될 때 실시간 구독 해제
    }, [cctvId, isRealTime]);

    return (
        <div>
            <Toggle
                isChecked={isRealTime}
                onChange={() => setIsRealTime(!isRealTime)}
                labelOn="실시간 혼잡도 On"
                labelOff="시간별 트렌드 분석"
            />
            <Line data={chartData} />
        </div>
    );
};

export default ChartData;
