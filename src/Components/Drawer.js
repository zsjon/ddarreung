import LostItemsTable from "./lostItemTable";
import { Button, Drawer } from "@mui/material";
import Box from "@mui/material/Box";

const streamURL1 = "http://192.168.1.26:8000/stream.mjpg";
// Drawer 컴포넌트
const CCTVDrawer = ({ open, selectedRow, selectedImage, onClose, onRetrieve, onReportBug, bikeRows, onImageClick }) => {
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
                        <img
                            src={streamURL1}  // 각 CCTV의 streamURL을 사용하여 실시간 스트리밍
                            alt="Live CCTV Stream"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </Box>

                    <p>{selectedRow.cctvAddress}</p>
                    <LostItemsTable rows={bikeRows} onImageClick={onImageClick} onRetrieve={onRetrieve} onReportBug={onReportBug} />
                </Box>
            )}
        </Drawer>
    );
};

export default CCTVDrawer;
