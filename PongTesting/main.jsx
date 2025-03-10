import React, { useEffect, useRef, useState } from "react";

const Pong = () => {
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  let ball = { x: 300, y: 200, dx: 4, dy: 4, radius: 10 };
  let paddle1 = { x: 20, y: 150, width: 10, height: 80 };
  let paddle2 = { x: 570, y: 150, width: 10, height: 80 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // paddles
      ctx.fillStyle = "white";
      ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
      ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
      
      //  ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
      
      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision (top/bottom)
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
      }

      // Ball collision (paddles)
      if (
        (ball.x - ball.radius < paddle1.x + paddle1.width && ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) ||
        (ball.x + ball.radius > paddle2.x && ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height)
      ) {
        ball.dx *= -1;
      }

      // Score update
      if (ball.x + ball.radius < 0) {
        setAiScore((prev) => prev + 1);
        resetBall();
      } else if (ball.x - ball.radius > canvas.width) {
        setPlayerScore((prev) => prev + 1);
        resetBall();
      }

      requestAnimationFrame(draw);
    };

    const resetBall = () => {
      ball.x = 300;
      ball.y = 200;
      ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
      ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
    };

    const handleKeyPress = (event) => {
      if (event.key === "ArrowUp" && paddle2.y > 0) paddle2.y -= 20;
      if (event.key === "ArrowDown" && paddle2.y < canvas.height - paddle2.height) paddle2.y += 20;
      if (event.key === "w" && paddle1.y > 0) paddle1.y -= 20;
      if (event.key === "s" && paddle1.y < canvas.height - paddle1.height) paddle1.y += 20;
    };

    window.addEventListener("keydown", handleKeyPress);
    draw();

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div>
      <h1>Pong Game</h1>
      <h2>Player: {playerScore} - AI: {aiScore}</h2>
      <canvas ref={canvasRef} width={600} height={400} style={{ background: "black" }} />
    </div>
  );
};

export default Pong;
