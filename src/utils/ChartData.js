import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // 필요한 요소를 가져옵니다.
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Firestore 초기화 파일

// Chart.js에 필요한 스케일과 플러그인 등록
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartData = ({ cctvId }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!cctvId) return; // cctvId가 없으면 아무 작업도 하지 않음

            const querySnapshot = await getDocs(collection(db, `seoul-cctv/${cctvId}/people-congestion`));
            const labels = [];
            const data = [];

            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                const averagePeopleCount = Math.floor(docData.average_people_count); // 소수점 앞 부분만 가져오기
                const timestamp = docData.timestamp.slice(0, 12); // 연/월/일/시/분까지만 슬라이스

                labels.push(timestamp); // 타임스탬프를 레이블로 사용
                data.push(averagePeopleCount); // 소수점 앞 자리 수를 데이터로 사용
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

        fetchData();
    }, [cctvId]); // cctvId가 변경될 때마다 데이터를 다시 불러옴

    return (
        <div>
            <Line data={chartData} />
        </div>
    );
};

export default ChartData;
