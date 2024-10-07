import {columns_Lost_Drawer} from "../Columns/columns_Lost_Drawer";
import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
// 유실물 DataGrid 컴포넌트
const LostItemsTable = ({ rows, onImageClick, onRetrieve, onReportBug }) => {
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns_Lost_Drawer(onImageClick, onRetrieve, onReportBug)}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                pageSize={10}
            />
        </Box>
    );
};

export default LostItemsTable;