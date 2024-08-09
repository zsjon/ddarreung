import React from 'react'
import MyMap from './MyMap'
import { Container as MapDiv } from 'react-naver-maps'

const NaverMapContainer = () => {
    return (
        <MapDiv style={{ width: '100%', height: '100%', marginTop: '-30px' }}>
            <MyMap />
        </MapDiv>

    )
}

export default NaverMapContainer;