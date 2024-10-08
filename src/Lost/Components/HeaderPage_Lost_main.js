import {IoListOutline} from "react-icons/io5";
// selected_park 페이지의 헤더 부분 컴포넌트
const HeaderPage_Lost_main = ({ parkName, onTitleClick }) => {
    return (
        <div className='header-website-main'>
            <button className='to-main-menu' onClick={onTitleClick} style={{ cursor: 'pointer' }}>
                <IoListOutline size="48" />
            </button>
            <h1 className='title-website'>공원별 유실물 현황</h1>
        </div>
    );
};

export default HeaderPage_Lost_main;