// 유실물 탐지 페이지용 공원 목록 테이블.
import Box from "@mui/material/Box";
import { DataGrid } from '@mui/x-data-grid';
import { columns_Lost_Park } from "../Columns/columns_Lost_Park";
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

const ParkListTable_Lost = ({ filteredParkRows }) => {
    const navigate = useNavigate();

    // 공원명을 클릭했을 때 해당 공원의 상세 페이지로 이동하는 함수
    const handleParkNameClick = (params) => {
        if (params.field === 'p_park') {
            const parkName = params.row.p_park;
            navigate(`/park-Lost/${encodeURIComponent(parkName)}`); // 공원 이름을 URL에 포함하여 이동
        }
    };

    return (
        <Box>
            <DataGrid
                rows={filteredParkRows} // 모든 공원을 출력
                columns={columns_Lost_Park}
                getRowId={(row) => row.p_idx}
                pageSizeOptions={[10, 50, 100]}
                pagination
                disableRowSelectionOnClick
                initialState={{ // 페이지 크기 초기값 설정
                    pagination: { paginationModel: { pageSize: 10 } }
                }}
                onCellClick={handleParkNameClick} // 공원명 클릭 시 라우팅
            />
        </Box>
    );
};

export default ParkListTable_Lost;
