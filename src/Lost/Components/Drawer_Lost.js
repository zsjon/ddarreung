import LostItemsTable from "./lostItemsTable";
import { Button, Drawer, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import ReactPlayer from "react-player";
import FanShapeCanvas from "../../utils/FanShapeCanvas"; // 부채꼴 애니메이션 컴포넌트 추가
import { useState } from 'react';

const recUrl = "http://192.168.1.38:8000/stream.mjpg";

const CCTVDrawer_Lost = ({ open, selectedRow, selectedImage, onClose, onRetrieve, onReportBug, bikeRows, onImageClick }) => {
    const [modalOpen, setModalOpen] = useState(false); // 모달 창 열림 상태 관리

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <Drawer anchor='left' open={open} onClose={onClose}>
                {selectedRow && (
                    <Box p={2} width="660px" textAlign="center" position="relative">
                        <Button onClick={onClose} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
                            닫기
                        </Button>
                        {/* 회전형 CCTV만 버튼 표시 */}
                        {!selectedRow.fixed && (
                            <Button onClick={handleOpenModal} variant="contained" color="secondary" style={{ marginBottom: '10px' }}>
                                CCTV 범위 확인
                            </Button>
                        )}
                        <h2>{selectedRow.id}</h2>

                        {/* 실시간 영상 스트리밍 */}
                        <Box width="660px" display='flex' alignItems='center' position="relative">
                            <img
                                src={recUrl}  // 각 CCTV의 streamURL을 사용하여 실시간 스트리밍
                                alt="Live CCTV Stream"
                                style={{ width: '50%', height: 'auto' }}
                            />
                        </Box>

                        <p>{selectedRow.cctvAddress}</p>

                        <LostItemsTable
                            rows={bikeRows}
                            onImageClick={onImageClick}
                            onRetrieve={onRetrieve}
                            onReportBug={onReportBug}
                        />
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
                        <img
                            alt="drawer image"
                            src={process.env.PUBLIC_URL + '/parkImage/seoulsoop_cctv0003.png'}
                            style={{ width: '100%', height: '100%' }}
                        />

                        {/* FanShapeCanvas 추가 */}
                        <Box
                            position="absolute"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%"
                        >
                            <FanShapeCanvas /> {/* 부채꼴 애니메이션 컴포넌트 */}
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

export default CCTVDrawer_Lost;
