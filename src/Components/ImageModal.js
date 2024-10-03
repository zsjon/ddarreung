import Box from "@mui/material/Box";
import { Modal, Typography } from "@mui/material";

// 모달 컴포넌트
const ImageModal = ({ open, imageURL, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 1200,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4
            }}>
                {imageURL ? (
                    <img
                        src={imageURL}
                        alt="Expanded CCTV"
                        style={{ width: '100%', height: 'auto' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "/bicycle.png"; }} // 이미지 로드 실패 시 대체 이미지 표시
                    />
                ) : (
                    <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                        이미지가 없습니다.
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export default ImageModal;
