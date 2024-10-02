import Box from "@mui/material/Box";
import {Modal} from "@mui/material";
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
                <img src={imageURL} alt="Expanded CCTV" style={{ width: '100%', height: 'auto' }} />
            </Box>
        </Modal>
    );
};

export default ImageModal;