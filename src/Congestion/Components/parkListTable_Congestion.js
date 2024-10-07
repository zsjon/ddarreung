import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns_Congestion_Park } from '../Columns/columns_Congestion_Park';
import {useNavigate} from "react-router-dom";

const ParkListTable_Congestion = ({ filteredParkRows }) => {
    const navigate = useNavigate();

    // 공원명을 클릭했을 때 해당 공원의 상세 페이지로 이동하는 함수
    const handleParkNameClick = (params) => {
        if (params.field === 'p_park') {
            const parkName = params.row.p_park;
            navigate(`/park-Congestion/${encodeURIComponent(parkName)}`); // 공원 이름을 URL에 포함하여 이동
        }
    };
    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={filteredParkRows}  // 공원 데이터를 전달
                columns={columns_Congestion_Park}  // 설정한 혼잡도 컬럼 사용
                pageSizeOptions={[10, 50, 100]}
                pagination
                disableRowSelectionOnClick
                getRowId={(row) => row.p_idx}  // 공원 ID를 row ID로 사용
                initialState={{ // 페이지 크기 초기값 설정
                    pagination: { paginationModel: { pageSize: 10 } }
                }}
                onCellClick={handleParkNameClick} // 공원명 클릭 시 라우팅
            />
        </div>
    );
};

export default ParkListTable_Congestion;
