import {Button, Drawer, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import ReactPlayer from "react-player";
import ChartData from "../../utils/ChartData";
import FanShapeCanvas from "../../utils/FanShapeCanvas";
import {useState} from "react"; // 차트 컴포넌트를 불러옵니다.



const CCTVDrawer_Congestion = ({ open, selectedRow, onClose }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    return (
        <>
        <Drawer anchor="left" open={open} onClose={onClose}>
            {selectedRow && (
                <Box p={2} width="660px" textAlign="center">
                    <Box display="flex" justifyContent="space-between">
                        <Button onClick={onClose} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
                            닫기
                        </Button>
                        <Button onClick={handleModalOpen} variant="outlined" color="secondary" style={{ marginBottom: '10px' }}>
                            CCTV 범위 확인
                        </Button>
                    </Box>
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
    {/* 모달 - CCTV 회전 범위를 확인할 수 있는 이미지와 FanShapeCanvas */}
    <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Box position="relative" width="600px" height="380px" bgcolor="white" p={2}>
            <Button onClick={handleModalClose} variant="contained" color="secondary" style={{ marginBottom: '10px' }}>
                닫기
            </Button>

            {/* 모달 안에서 보여줄 CCTV 이미지와 부채꼴 애니메이션 */}
            <Box position="relative" width="100%" height="100%">
                <img
                    alt="drawer image"
                    src={process.env.PUBLIC_URL + '/parkImage/seoulsoop_cctv0003.png'} // 로컬 이미지 사용
                    style={{ width: '100%', height: 'auto' }}
                />
                <Box position="absolute" top="0" left="0" width="100%" height="100%">
                    <FanShapeCanvas /> {/* 부채꼴 애니메이션 */}
                </Box>
            </Box>
        </Box>
    </Modal>
            </>
    );
};

export default CCTVDrawer_Congestion;
