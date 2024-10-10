import { MdHome } from "react-icons/md";
// selected_park 페이지의 헤더 부분 컴포넌트
const HeaderPage_Congestion_main = ({ onTitleClick }) => {
    return (
        <div className='header-website-main'>
            <button className='to-main-menu' onClick={onTitleClick} style={{ cursor: 'pointer' }}>
                <MdHome  size="48" />
            </button>
            <h1 className='title-website'>전체 혼잡도 현황</h1>
        </div>
    );
};

export default HeaderPage_Congestion_main;