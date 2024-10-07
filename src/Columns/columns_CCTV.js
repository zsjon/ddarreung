// 유실물 탐지 페이지용 공원별 CCTV Column.
export const columns_CCTV = [
    {
        field: 'id',
        headerName: 'CCTV ID',
        // flex: 1
    },
    {
        field: 'fixed',   // 차후 고정형||회전형 2가지로 분류하기
        headerName: 'CCTV 종류',
        flex: 1,
        renderCell: (params) => (params.value ? '고정형' : '회전형'),
    },
    {
        field: 'foundLost',
        headerName: '유실물 개수',
        flex: 1
    },
    {
        field: 'lastFoundTime',
        headerName: '유실물 최종 감지 시각',
        flex: 1
    },
];