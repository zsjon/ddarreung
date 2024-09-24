import {Button} from "@mui/material";

export const columns_Lost = (handleDeleteRow) => [
    {
        field: "id",
        headerName: "유실물 ID",
        flex: 2,
    },
    {
        field: "firstFoundTime",
        headerName: "최초 발견 시각",
        flex: 2,
    },
    {
        field: "lastFoundTime",
        headerName: "최종 발견 시각",
        flex: 2,
    },
    {
        field: "delete",
        headerName: "Delete",
        renderCell: (params) => (
            <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteRow(params.id)} // Pass rowId to delete handler
            >
                삭제
            </Button>
        ),
    },
];