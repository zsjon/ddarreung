export const columns_Park = [
    {
        field: 'p_idx',
        headerName: '공원 ID',
        width: 80,
    },
    {
        field: 'p_park',
        headerName: '공원명',
        flex: 1,
        renderCell: (params) => (
            <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                {params.value}
            </span>
        ),
    },
    {
        field: 'p_addr',
        headerName: '공원주소',
        flex: 1,
    },
    {
        field: 'cctvCount',
        headerName: '유실물 발견 CCTV 대수',
        width: 200,
    },
];