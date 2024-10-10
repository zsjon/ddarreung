import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // Firebase 초기화 파일

const useCctvAngle = (selectedRow, open) => {
    const [cctvAngle, setCctvAngle] = useState(null); // CCTV 감지 방향 상태 관리
    const [modalOpen, setModalOpen] = useState(false); // 모달 창 열림 상태 관리

    // Firestore에서 CCTV 방향을 가져오거나 설정하는 함수
    const fetchOrSetCctvAngle = async () => {
        if (selectedRow && selectedRow.id) {
            const cctvRef = doc(db, "seoul-cctv", selectedRow.id);
            const cctvDoc = await getDoc(cctvRef);

            if (cctvDoc.exists()) {
                const data = cctvDoc.data();
                if (data.cctvAngle) {
                    setCctvAngle(data.cctvAngle); // Firestore에 저장된 CCTV 방향 사용
                } else {
                    const randomAngle = Math.floor(Math.random() * 180) - 90; // -90도에서 90도 사이의 랜덤 각도 설정
                    await updateDoc(cctvRef, { cctvAngle: randomAngle }); // Firestore에 저장
                    setCctvAngle(randomAngle);
                }
            }
        }
    };

    useEffect(() => {
        if (open && selectedRow) {
            fetchOrSetCctvAngle(); // Drawer가 열릴 때마다 CCTV 방향 가져오기 또는 설정
        }
    }, [open, selectedRow]);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return { cctvAngle, modalOpen, handleOpenModal, handleCloseModal };
};

export default useCctvAngle;
