// 유실물 탐지 페이지용 공원별 CCTV Column.
export const columns_Congestion_CCTV = [
    {
        field: 'id',
        headerName: 'CCTV ID',
        flex: 1
    },
    {
        field: 'fixed',   // 차후 고정형||회전형 2가지로 분류하기
        headerName: 'CCTV 종류',
        flex: 1,
        renderCell: (params) => (params.value ? '고정형' : '회전형'),
    },
    {
        field: 'congestionLevel',
        headerName: '혼잡도',
        flex: 1,
        renderCell: (params) => (
            <span style={{
                color: params.value === '혼잡' ? 'red' : params.value === '보통' ? 'orange' : 'green' }}>
                {params.value}
            </span>
        )
    },
];