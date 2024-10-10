import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Toggle from './Toggle';  // Toggle 컴포넌트 추가

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartData = ({ cctvId }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [isRealTime, setIsRealTime] = useState(true);  // 토글 상태 (실시간/시간별 트렌드)

    // 실시간 데이터를 가져오는 함수
    const fetchRealTimeData = async () => {
        if (!cctvId) return;

        const querySnapshot = await getDocs(collection(db, `seoul-cctv/${cctvId}/people-congestion`));
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

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Average People Count",
                    data: data,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)"
                }
            ]
        });
    };

    // 분 단위 데이터를 가져오는 함수
    const fetchMinuteTrendData = async () => {
        if (!cctvId) return;

        const querySnapshot = await getDocs(collection(db, `seoul-cctv/${cctvId}/people-congestion`));
        const minuteData = {};

        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const averagePeopleCount = Math.floor(docData.average_people_count);

            const timestamp = docData.timestamp;
            const minuteKey = timestamp.slice(0, 10); // 연/월/일/시/분 단위로 키 생성

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

            const formattedMinute = `${minuteKey.slice(0, 2)}/${minuteKey.slice(2, 4)}/${minuteKey.slice(4, 6)} ${minuteKey.slice(6, 8)}:${minuteKey.slice(8, 10)}`;

            labels.push(formattedMinute);
            data.push(average);
        });

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Minute Average People Count",
                    data: data,
                    fill: true,
                    backgroundColor: "rgba(192, 75, 192, 0.2)",
                    borderColor: "rgba(192, 75, 192, 1)"
                }
            ]
        });
    };

    // useEffect로 토글 상태에 따라 데이터를 가져옴
    useEffect(() => {
        if (isRealTime) {
            fetchRealTimeData();
        } else {
            fetchMinuteTrendData();
        }
    }, [isRealTime, cctvId]);

    return (
        <div>
            {/* 토글 스위치 */}
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
