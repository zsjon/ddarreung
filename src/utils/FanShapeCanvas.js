import React, { useRef, useEffect, useState } from 'react';

const FanShapeCanvas = () => {
    const canvasRef = useRef(null);
    const [angle, setAngle] = useState(0); // 현재 회전 각도
    const [direction, setDirection] = useState(1); // 회전 방향 (1은 시계 방향, -1은 반시계 방향)

    // 부채꼴 그리기 함수
    const drawFan = (ctx, angle) => {
        const x = ctx.canvas.width / 2 + 15; // 중심점 x
        const y = ctx.canvas.height / 2 + 10; // 중심점 y
        const radius = Math.min(x, y) - 100; // 반지름 설정

        // 부채꼴 그리기
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 캔버스 초기화
        ctx.beginPath();
        ctx.moveTo(x, y); // 시작점을 중심으로 이동
        ctx.arc(x, y, radius, (Math.PI * (angle - 90)) / 180, (Math.PI * (angle + 90)) / 180); // 180도 호 그리기
        ctx.lineTo(x, y); // 중심으로 선 그리기
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // 반투명 빨간색
        ctx.fill();
        ctx.closePath();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let animationFrameId;

        const render = () => {
            drawFan(ctx, angle); // 부채꼴을 그린다
            setAngle((prevAngle) => {
                let newAngle = prevAngle + direction * 0.001; // 각도를 0.01도씩 변화
                // 90도 또는 -90도에 도달하면 방향을 바꿈
                if (newAngle >= 90 || newAngle <= -90) {
                    setDirection((direction)*-1); // 방향 전환
                }
                return newAngle;
            });
            animationFrameId = requestAnimationFrame(render); // 애니메이션 반복
        };

        render(); // 애니메이션 시작

        return () => {
            cancelAnimationFrame(animationFrameId); // 컴포넌트 언마운트 시 애니메이션 정지
        };
    }, [angle, direction]);

    return (
        <div>
            <canvas ref={canvasRef} width={300} height={300} />
        </div>
    );
};

export default FanShapeCanvas;
