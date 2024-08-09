// import {NavermapsProvider} from "react-naver-maps";
//
//
// const MainPage = () => {
//
//
//
//     return (
//         <NavermapsProvider
//             ncpClientId='ahznufizx8'
//             // or finClientId, govClientId
//         >
//
//         </NavermapsProvider>
//     );
//
// };
//
// export default MainPage;

import React from 'react'
// import MapNavigation from './MapNavigation'
// import GlobalCSS from '../../Style/GlobalCSS'
import NaverMapContainer from './NaverMapContainer'
import { NavermapsProvider } from 'react-naver-maps';
// css 초기화 ! Map 페이지만 적용


const MainPage = () => {
    return (

        <NavermapsProvider
            ncpClientId='ahznufizx8'>
        {/*<GlobalCSS />*/}
        {/*<MapNavigation />*/}
        <NaverMapContainer />
        </NavermapsProvider>

)
}

export default MainPage;
// <NaverMapsProvider
//     ncpClientId='ahznufizx8'/>