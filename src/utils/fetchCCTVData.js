// // import { collection, getDocs } from "firebase/firestore";
// // import { db } from "../firebase";
// //
// // // CCTV 데이터를 Firestore에서 가져오는 함수
// // export const fetchCCTVData = async (formatFoundTime) => {
// //     const querySnapshot = await getDocs(collection(db, "seoul-cctv"));
// //     const fetchedRows = await Promise.all(
// //         querySnapshot.docs.map(async (doc) => {
// //             const data = doc.data();
// //             const bikeCollection = await getDocs(collection(db, `seoul-cctv/${doc.id}/missing-seoul-bike`));
// //             const bikeData = bikeCollection.docs.map(bikeDoc => ({
// //                 ...bikeDoc.data(),
// //                 firstFoundTime: formatFoundTime(bikeDoc.data().firstFoundTime),
// //                 lastFoundTime: formatFoundTime(bikeDoc.data().lastFoundTime),
// //             }));
// //             return {
// //                 ...data,
// //                 bikeData: bikeData, // 유실물 정보 포함
// //             };
// //         })
// //     );
// //     return fetchedRows;
// // };
//
//
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import parkData from "../parkList.json"; // 공원 데이터
//
// // 좌표 간 거리 계산 함수
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3;
//     const φ1 = lat1 * (Math.PI / 180);
//     const φ2 = lat2 * (Math.PI / 180);
//     const Δφ = (lat2 - lat1) * (Math.PI / 180);
//     const Δλ = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//         Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//         Math.cos(φ1) * Math.cos(φ2) *
//         Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
// };
//
// // 데이터 형식 변환 함수
// const formatFoundTime = (timestamp) => {
//     const year = timestamp.slice(0, 2);
//     const month = timestamp.slice(2, 4);
//     const day = timestamp.slice(4, 6);
//     const hour = timestamp.slice(6, 8);
//     const minute = timestamp.slice(8, 10);
//     return `20${year}/${month}/${day} ${hour}:${minute}`;
// };
//
// const fetchCCTVData = async (parkName, cctvDirections, saveCctvDirections, getReverseGeocoding) => {
//     try {
//         const querySnapshot = await getDocs(collection(db, "seoul-cctv"));
//         const fetchedRows = await Promise.all(
//             querySnapshot.docs.map(async (doc) => {
//                 const data = doc.data();
//                 const bikeCollection = await getDocs(collection(db, `seoul-cctv/${doc.id}/missing-seoul-bike`));
//                 const bikeData = bikeCollection.docs
//                     .map(bikeDoc => ({
//                         ...bikeDoc.data(),
//                         firstFoundTime: formatFoundTime(bikeDoc.data().firstFoundTime),
//                         lastFoundTime: formatFoundTime(bikeDoc.data().lastFoundTime),
//                         lat: bikeDoc.data().lat,
//                         lon: bikeDoc.data().lon,
//                         imageURL: bikeDoc.data().imageURL,
//                         id: bikeDoc.id,
//                         retrieveYn: bikeDoc.data().retrieveYn || false,
//                         retrieveTime: bikeDoc.data().retrieveTime || null,
//                         fixed: bikeDoc.data().fixed || false
//                     }))
//                     .filter(bike => !bike.retrieveYn);
//
//                 const address = await getReverseGeocoding(data.lat, data.lon);
//
//                 if (!cctvDirections[data.id]) {
//                     cctvDirections[data.id] = Math.floor(Math.random() * 360);
//                     saveCctvDirections();
//                 }
//
//                 const lastFoundTime = bikeData.length > 0
//                     ? bikeData.reduce((latest, bike) => (bike.lastFoundTime > latest ? bike.lastFoundTime : latest), bikeData[0].lastFoundTime)
//                     : null;
//
//                 return {
//                     id: data.id,
//                     cctvLat: data.lat,
//                     cctvLon: data.lon,
//                     imageURL: data.imageURL,
//                     cctvAddress: address,
//                     bikeData: bikeData,
//                     foundLost: bikeData.length,
//                     lastFoundTime: lastFoundTime,
//                     fixed: data.fixed || false
//                 };
//             })
//         );
//
//         const selectedPark = parkData.DATA.find(park => park.p_park === parkName);
//         if (!selectedPark) {
//             console.error("선택된 공원을 찾을 수 없습니다.");
//             return { fetchedRows: [], filteredParks: [] };
//         }
//
//         const filteredCCTV = fetchedRows.filter(cctv => {
//             const distance = calculateDistance(
//                 parseFloat(selectedPark.latitude), parseFloat(selectedPark.longitude),
//                 parseFloat(cctv.cctvLat), parseFloat(cctv.cctvLon)
//             );
//             return distance <= 300 && cctv.bikeData.length > 0;
//         });
//
//         const parksWithCCTV = parkData.DATA.filter((park) => {
//             const hasMatchingCCTV = fetchedRows.some(cctv => {
//                 const distance = calculateDistance(
//                     parseFloat(park.latitude), parseFloat(park.longitude),
//                     parseFloat(cctv.cctvLat), parseFloat(cctv.cctvLon)
//                 );
//                 return distance <= 300 && cctv.bikeData.length > 0;
//             });
//             return hasMatchingCCTV;
//         });
//
//         return { fetchedRows: filteredCCTV, filteredParks: parksWithCCTV };
//     } catch (error) {
//         console.error("Error fetching data from Firestore:", error);
//         return { fetchedRows: [], filteredParks: [] };
//     }
// };
//
// export default fetchCCTVData;


import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import parkData from "../parkList.json"; // 공원 데이터

// 좌표 간 거리 계산 함수
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// 데이터 형식 변환 함수
const formatFoundTime = (timestamp) => {
    const year = timestamp.slice(0, 2);
    const month = timestamp.slice(2, 4);
    const day = timestamp.slice(4, 6);
    const hour = timestamp.slice(6, 8);
    const minute = timestamp.slice(8, 10);
    return `20${year}/${month}/${day} ${hour}:${minute}`;
};

// 특정 공원 내 CCTV만 가져오도록 하거나, 전체 CCTV 데이터를 반환하는 함수
const fetchCCTVData = async (parkName = null) => {
    try {
        const querySnapshot = await getDocs(collection(db, "seoul-cctv"));
        const fetchedRows = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
                const data = doc.data();
                const bikeCollection = await getDocs(collection(db, `seoul-cctv/${doc.id}/missing-seoul-bike`));
                const bikeData = bikeCollection.docs.map(bikeDoc => ({
                    ...bikeDoc.data(),
                        firstFoundTime: formatFoundTime(bikeDoc.data().firstFoundTime),
                        lastFoundTime: formatFoundTime(bikeDoc.data().lastFoundTime),
                        lat: bikeDoc.data().lat,
                        lon: bikeDoc.data().lon,
                        imageURL: bikeDoc.data().imageURL,
                        id: bikeDoc.id,
                        retrieveYn: bikeDoc.data().retrieveYn || false,
                        retrieveTime: bikeDoc.data().retrieveTime || null,
                        fixed: bikeDoc.data().fixed || false,
                }));

                return {
                    ...data,
                    bikeData: bikeData,
                };
            })
        );

        // 특정 공원에 대해서만 CCTV 데이터를 필터링하는 경우
        if (parkName) {
            const selectedPark = parkData.DATA.find(park => park.p_park === parkName);
            if (!selectedPark) {
                console.error("선택된 공원을 찾을 수 없습니다.");
                return [];
            }

            const filteredCCTV = fetchedRows.filter(cctv => {
                const distance = calculateDistance(
                    parseFloat(selectedPark.latitude),
                    parseFloat(selectedPark.longitude),
                    parseFloat(cctv.lat),
                    parseFloat(cctv.lon)
                );
                return distance <= 300 && cctv.bikeData.length > 0;
            });

            return filteredCCTV;
        }

        // 전체 공원 데이터와 연관된 CCTV 반환
        return fetchedRows;
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        return [];
    }
};

export { fetchCCTVData, calculateDistance, formatFoundTime };
