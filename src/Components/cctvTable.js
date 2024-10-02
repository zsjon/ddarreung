import {columns_CCTV} from "../columns/columns_CCTV";
import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
// CCTV DataGrid 컴포넌트
const CCTVTable = ({ rows, pageSize, setPageSize, onRowClick }) => {
    return (
        <Box>
            <DataGrid
                rows={rows}
                columns={columns_CCTV}
                onCellClick={onRowClick}
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10, 50, 100]}
                pagination
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            />
        </Box>
    );
};

export default CCTVTable;