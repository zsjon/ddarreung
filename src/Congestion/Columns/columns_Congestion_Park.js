// 혼잡도 분석 페이지용 혼잡도 Column.
export const columns_Congestion_Park = [
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
        field: 'peopleCount',
        headerName: '공원 혼잡도',
        width: 200,
    },
];