import parkList from './parkList.json';

const ParkOptions = parkList.DATA.map((park) => ({
    name: park.p_park,
    lat: parseFloat(park.latitude),
    lon: parseFloat(park.longitude)
}));

export default ParkOptions;