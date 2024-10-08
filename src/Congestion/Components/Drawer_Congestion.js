import { Button, Drawer } from "@mui/material";
import Box from "@mui/material/Box";
import ReactPlayer from "react-player";
import ChartData from "../../utils/ChartData"; // 차트 컴포넌트를 불러옵니다.

const CCTVDrawer_Congestion = ({ open, selectedRow, onClose }) => {
    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            {selectedRow && (
                <Box p={2} width="660px" textAlign="center">
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="primary"
                        style={{ marginBottom: "10px" }}
                    >
                        닫기
                    </Button>
                    <h2>{selectedRow.id}</h2>

                    {/* 실시간 영상 스트리밍 */}
                    <Box>
                        <ReactPlayer
                            url={process.env.PUBLIC_URL + "/peopleREC.mp4"}
                            playing={true}
                            muted={true}
                            controls={false}
                            loop={false}
                        />
                    </Box>

                    <p>{selectedRow.cctvAddress}</p>

                    <Box>
                        {/* selectedRow에 포함된 혼잡도(congestionLevel) 값을 표시 */}
                        <h1>구역 혼잡도: {selectedRow.congestionLevel}</h1>
                    </Box>

                    {/* 차트 컴포넌트를 추가 */}
                    <Box>
                        {/*<h2>시간별 평균 사람 수</h2>*/}
                        {/* selectedRow.id를 기반으로 ChartData에 CCTV 데이터를 전달 */}
                        <ChartData cctvId={selectedRow.id} />
                    </Box>
                </Box>
            )}
        </Drawer>
    );
};

export default CCTVDrawer_Congestion;
