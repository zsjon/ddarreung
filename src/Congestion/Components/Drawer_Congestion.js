import { Button, Drawer, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import FanShapeCanvas from "../../utils/FanShapeCanvas";
import useCctvAngle from "../../utils/useCCTVAngle";
import ChartData from "../../utils/ChartData"; // 커스텀 훅 가져오기

const recUrl = "http://172.30.1.16:8000/stream.mjpg";

const CCTVDrawer_Congestion = ({ open, selectedRow, onClose }) => {
    const { cctvAngle, modalOpen, handleOpenModal, handleCloseModal } = useCctvAngle(selectedRow, open); // 커스텀 훅 사용

    return (
        <>
            <Drawer anchor="left" open={open} onClose={onClose}>
                {selectedRow && (
                    <Box p={2} width="660px" textAlign="center">
                        <Box display="flex" justifyContent="space-between">
                            <Button onClick={onClose} variant="contained" color="primary" style={{ marginBottom: '10px', marginRight: '70px' }}>
                                닫기
                            </Button>

                            <h2>{selectedRow.id}</h2>

                            <Button onClick={handleOpenModal} variant="contained" color="secondary" style={{ marginBottom: '10px' }}>
                                CCTV 범위 확인
                            </Button>
                        </Box>

                        {/* 실시간 영상 스트리밍 */}
                        <Box>
                            <img src={recUrl} alt="Live streaming" style={{ width: '60%', height: 'auto' }} />
                        </Box>

                        <p>{selectedRow.cctvAddress}</p>

                        <Box margin="8px">
                            <h1>구역 혼잡도: {selectedRow.congestionLevel}</h1>
                        </Box>

                        {/* 차트 컴포넌트를 추가 */}
                        <Box>
                            <ChartData cctvId={selectedRow.id} />
                        </Box>
                    </Box>
                )}
            </Drawer>

            {/* 모달 창 */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    p={2}
                    width="600px"
                    height="430px"
                    bgcolor="white"
                    borderRadius="10px"
                    position="absolute"
                    top="50%"
                    left="50%"
                    style={{ transform: 'translate(-50%, -50%)' }}
                    textAlign="center"
                >
                    <h2 id="modal-title">CCTV 회전 범위</h2>
                    <Box
                        position="relative"
                        width="100%"
                        height="350px"
                    >
                        {/* selectedRow가 존재할 때만 img를 표시 */}
                        {selectedRow && (
                            <img
                                alt="drawer image"
                                src={`${process.env.PUBLIC_URL}/parkImage/${selectedRow.id}.png`}
                                style={{ width: '100%', height: '100%' }}
                            />
                        )}

                        {/* FanShapeCanvas 추가, cctvAngle을 기준으로 ±90도 범위 표시 */}
                        <Box
                            position="absolute"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%"
                        >
                            {selectedRow && (
                                <FanShapeCanvas angle={cctvAngle} isFixed={selectedRow.fixed} />
                            )}
                        </Box>
                    </Box>

                    <Button onClick={handleCloseModal} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                        닫기
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default CCTVDrawer_Congestion;
