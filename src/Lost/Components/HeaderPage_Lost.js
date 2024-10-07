import {IoListOutline} from "react-icons/io5";
// selected_park 페이지의 헤더 부분 컴포넌트
const HeaderPage_Lost = ({ parkName, suspiciousItemCount, lostItemCount, filteredParkOptions, onParkChange, onTitleClick }) => {
    return (
        <div className='header-website'>
            <button className='to-main-menu' onClick={onTitleClick} style={{ cursor: 'pointer' }}>
                <IoListOutline size="48" />
            </button>
            <h1 className='title-website'>{parkName} 유실물 현황</h1>
            <h1 className='lost-item-count'>의심:{suspiciousItemCount} 분실:{lostItemCount}</h1>
            <select className='button' onChange={onParkChange} value={parkName}>
                <option value="">공원 선택</option>
                {filteredParkOptions.map(park => (
                    <option key={park.p_park} value={park.p_park}>{park.p_park}</option>
                ))}
            </select>
        </div>
    );
};

export default HeaderPage_Lost;