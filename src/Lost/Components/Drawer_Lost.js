import LostItemsTable from "./lostItemsTable";
import { Button, Drawer } from "@mui/material";
import Box from "@mui/material/Box";
import ReactPlayer from "react-player";
import FanShapeCanvas from "../../utils/FanShapeCanvas"; // 부채꼴 애니메이션 컴포넌트 추가
import { useState } from 'react';
const recUrl = "http://192.168.1.38:8000/stream.mjpg"

const CCTVDrawer_Lost = ({ open, selectedRow, selectedImage, onClose, onRetrieve, onReportBug, bikeRows, onImageClick }) => {
    return (
        <Drawer anchor='left' open={open} onClose={onClose}>
            {selectedRow && (
                <Box p={2} width="1350px" textAlign="center" position="relative">
                    <Button onClick={onClose} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
                        닫기
                    </Button>
                    <h2>{selectedRow.id}</h2>

                    {/* 실시간 영상 스트리밍 */}
                    <Box width="1350px" display='flex' alignItems='center' position="relative">
                        <ReactPlayer
                            url={process.env.PUBLIC_URL + '/peopleREC.mp4'}
                            playing={true}
                            muted={true}
                            controls={false}
                            loop={false}
                        />

                        {/* 이미지 위에 부채꼴 애니메이션 */}
                        <Box position="relative" marginLeft="20px" width="600px" height="350px">
                            <img
                                alt="drawer image"
                                src={process.env.PUBLIC_URL + '/parkImage/seoulsoop_cctv0003.png'}
                                style={{ width: '100%', height: '350px', marginLeft: '20px' }}
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
                    </Box>
                    <p>{selectedRow.cctvAddress}</p>
                    <LostItemsTable rows={bikeRows} onImageClick={onImageClick} onRetrieve={onRetrieve} onReportBug={onReportBug} />
                </Box>
            )}
        </Drawer>
    );
};

export default CCTVDrawer_Lost;
