import LostItemsTable from "./lostItemTable";
import {Button, Drawer} from "@mui/material";
import Box from "@mui/material/Box";
// Drawer 컴포넌트
const CCTVDrawer = ({ open, selectedRow, selectedImage, onClose, onRetrieve, onReportBug, bikeRows, onImageClick }) => {
    return (
        <Drawer anchor='left' open={open} onClose={onClose}>
            {selectedRow && (
                <Box p={2} width="650px" textAlign="center">
                    <Button onClick={onClose} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
                        닫기
                    </Button>
                    <h2>{selectedRow.id}</h2>
                    {/*<img*/}
                    {/*    src={selectedImage}*/}
                    {/*    alt="CCTV Image"*/}
                    {/*    style={{ width: '100%', height: 'auto', cursor: 'pointer' }}*/}
                    {/*    onClick={() => onImageClick(selectedImage)}*/}
                    {/*/>*/}
                    {/*실시간 스트리밍이 들어갈 자리*/}
                    <p>{selectedRow.cctvAddress}</p>
                    <p>해당 CCTV가 보여주는 따릉이 정보</p>
                    <LostItemsTable rows={bikeRows} onImageClick={onImageClick} onRetrieve={onRetrieve} onReportBug={onReportBug} />
                </Box>
            )}
        </Drawer>
    );
};

export default CCTVDrawer;