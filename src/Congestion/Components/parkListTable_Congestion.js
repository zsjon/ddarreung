import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { columns_Congestion_Park } from '../Columns/columns_Congestion_Park';
import {useNavigate} from "react-router-dom";

const ParkListTable_Congestion = ({ filteredParkRows }) => {
    const navigate = useNavigate();

    // 공원명을 클릭했을 때 해당 공원의 상세 페이지로 이동하는 함수
    const handleParkNameClick = (params) => {
        if (params.field === 'p_park') {
            const parkName = params.row.p_park;
            navigate(`/park-Congestion/${encodeURIComponent(parkName)}`); // 공원 이름을 URL에 포함하여 이동.
        }
    };
    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={filteredParkRows}
                columns={columns_Congestion_Park}
                pageSizeOptions={[10, 50, 100]}
                pagination
                disableRowSelectionOnClick
                getRowId={(row) => row.p_idx}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } }
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },
                }}
                onCellClick={handleParkNameClick}
            />
        </div>
    );
};

export default ParkListTable_Congestion;
