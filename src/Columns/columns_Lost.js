// 유실물 탐지 페이지용 CCTV별 유실물 Column.
import {Button} from "@mui/material";
import BugReportIcon from '@mui/icons-material/BugReport';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ImageIcon from '@mui/icons-material/Image';

export const columns_Lost = (handleImageClick, handleRetrieve, handleReportBug) => [
    {
        field: "id",
        headerName: "유실물 ID",
        flex: 2,
    },
    {
        field: "firstFoundTime",
        headerName: "최초 발견 시각",
        flex: 3,
    },
    {
        field: "lastFoundTime",
        headerName: "최종 발견 시각",
        flex: 3,
    },
    {
        field: "imageCheck",
        headerName: "사진 확인",
        flex: 2,
        renderCell: (params) => (
            <Button
                size="small"
                startIcon={<ImageIcon />}
                variant="outlined"
                color="primary"
                onClick={() => handleImageClick(params.row.imageURL)} // 이미지 URL을 넘겨줌
            >
                확인
            </Button>
        ),
    },
    {
        field: "delete",
        headerName: "회수",
        flex: 2,
        renderCell: (params) => (
            <Button
                size="small"
                startIcon={<AssignmentTurnedInIcon/>}
                variant="outlined"
                color="success"
                onClick={() => handleRetrieve(params.id)} // Pass rowId to delete handler
            >
                회수
            </Button>
        ),
    },
    {
        field: "bugFix",
        headerName: "버그 신고",
        flex: 2,
        renderCell: (params) => (
            <Button
                size="small"
                startIcon={<BugReportIcon/>}
                fontSize="small"
                variant="outlined"
                color="error"
                onClick={() => handleReportBug(params.id)} // Pass rowId to delete handler
            >
                오류
                
            </Button>
        ),
    },
];