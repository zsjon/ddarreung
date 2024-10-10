import React, { useRef, useEffect, useState } from 'react';

const FanShapeCanvas = ({ angle, isFixed }) => { // isFixed prop 추가
    const canvasRef = useRef(null);
    const [currentAngle, setCurrentAngle] = useState(angle); // 초기 각도는 전달받은 CCTV 각도
    const [direction, setDirection] = useState(1); // 회전 방향 (1은 시계 방향, -1은 반시계 방향)

    // 부채꼴 그리기 함수
    const drawFan = (ctx, baseAngle) => {
        const x = ctx.canvas.width / 2 + 7; // 중심점 x
        const y = ctx.canvas.height / 2 - 8; // 중심점 y
        const radius = Math.min(x, y) - 100; // 반지름 설정

        // 부채꼴 그리기
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 캔버스 초기화
        ctx.beginPath();
        ctx.moveTo(x, y); // 시작점을 중심으로 이동
        ctx.arc(
            x, y,
            radius,
            (Math.PI * (baseAngle - 90)) / 180, // baseAngle - 90도부터 시작
            (Math.PI * (baseAngle + 90)) / 180  // baseAngle + 90도까지 그리기
        );
        ctx.lineTo(x, y); // 중심으로 선 그리기
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // 반투명 빨간색
        ctx.fill();
        ctx.closePath();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let animationFrameId;

        if (!isFixed) { // 회전형 CCTV일 경우에만 애니메이션을 적용
            const render = () => {
                drawFan(ctx, currentAngle); // 부채꼴을 그린다
                setCurrentAngle((prevAngle) => {
                    let newAngle = prevAngle + direction * 0.001; // 각도를 0.5도씩 변화
                    // ±90도 범위를 넘으면 회전 방향을 반대로 바꿈
                    if (newAngle >= angle + 90 || newAngle <= angle - 90) {
                        setDirection(direction * -1); // 방향 전환
                    }
                    return newAngle;
                });
                animationFrameId = requestAnimationFrame(render); // 애니메이션 반복
            };

            render(); // 애니메이션 시작
        } else {
            // 고정형 CCTV일 경우 부채꼴을 한 번만 그린다
            drawFan(ctx, angle);
        }

        return () => {
            if (!isFixed) {
                cancelAnimationFrame(animationFrameId); // 컴포넌트 언마운트 시 애니메이션 정지
            }
        };
    }, [currentAngle, direction, angle, isFixed]);

    return (
        <div>
            <canvas ref={canvasRef} width={600} height={350} style={{ display: 'block', margin: '0 auto' }} /> {/* 캔버스 사이즈 조정 */}
        </div>
    );
};

export default FanShapeCanvas;
