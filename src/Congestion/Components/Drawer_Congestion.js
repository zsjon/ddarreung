import { Button, Drawer } from "@mui/material";
import Box from "@mui/material/Box";
import ReactPlayer from "react-player";

// const recURL = "http://192.168.1.38:8000/stream.mjpg"; // 한 CCTV에서 2개의 영상 스트림 주소가 생성.
// const recURL = "."; // 한 CCTV에서 2개의 영상 스트림 주소가 생성.
// 혼잡도 Drawer 컴포넌트. 해당 Drawer에서는 오로지 사람이 박싱된 실시간 영상만을 보여주고, 하단에는 혼잡도 정도를 표시하는 텍스트만 둔다.
const CCTVDrawer_Congestion = ({ open, selectedRow, selectedImage, onClose, onRetrieve, onReportBug, bikeRows, cctvRows, onImageClick }) => {
    return (
        <Drawer anchor='left' open={open} onClose={onClose}>
            {selectedRow && (
                <Box p={2} width="660px" textAlign="center">
                    <Button onClick={onClose} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
                        닫기
                    </Button>
                    <h2>{selectedRow.id}</h2>

                    {/* 실시간 영상 스트리밍 */}
                    <Box>
                        <ReactPlayer    // 임의의 로컬 동영상 재생
                            url={process.env.PUBLIC_URL + '/peopleREC.mp4'}
                            playing={true}
                            muted={true}
                            controls={false}
                            loop={true}
                        />
                    </Box>

                    <p>{selectedRow.cctvAddress}</p>
                    <Box>
                        {/* selectedRow에 포함된 혼잡도(congestionLevel) 값을 표시 */}
                        <h1>구역 혼잡도: {selectedRow.congestionLevel}</h1>
                    </Box>
                </Box>
            )}
        </Drawer>
    );
};

export default CCTVDrawer_Congestion;
