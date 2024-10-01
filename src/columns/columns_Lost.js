import {Button} from "@mui/material";
import BugReportIcon from '@mui/icons-material/BugReport';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export const columns_Lost = (handleRetrieve, handleReportBug) => [
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
        field: "delete",
        headerName: "회수",
        flex: 2,
        renderCell: (params) => (
            <Button
                size="small"
                startIcon={<AssignmentTurnedInIcon/>}
                variant="outlined"
                color="primary"
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