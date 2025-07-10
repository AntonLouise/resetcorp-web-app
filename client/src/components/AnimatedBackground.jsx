import React from "react";

const AnimatedBackground = () => (
  <div className="animated-bg-container">
    <div className="blur-overlay"></div>
    {/* Dot grids */}
    <div className="geometric-element dots-grid top-left"></div>
    <div className="geometric-element dots-grid top-right"></div>
    <div className="geometric-element dots-grid bottom-center"></div>
    {/* Diagonal lines */}
    <div className="geometric-element diagonal-lines top-right"></div>
    <div className="geometric-element diagonal-lines bottom-right"></div>
    {/* Triangles */}
    <div className="geometric-element triangle large"></div>
    <div className="geometric-element triangle small"></div>
    <div className="geometric-element triangle outline"></div>
    {/* Circles */}
    <div className="geometric-element circle large"></div>
    <div className="geometric-element circle medium"></div>
    <div className="geometric-element circle small"></div>
    <style>{`
      .animated-bg-container {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        pointer-events: none;
        background: linear-gradient(180deg, #b2f0e6 0%, #d0f7c6 100%);
        overflow: hidden;
      }
      .geometric-element {
        position: absolute;
        opacity: 0.75;
      }
      .dots-grid {
        width: 120px;
        height: 80px;
        background-image: radial-gradient(circle, white 2px, transparent 2px);
        background-size: 12px 12px;
        animation: float1 6s ease-in-out infinite;
      }
      .dots-grid.top-left { top: 40px; left: 60px; }
      .dots-grid.top-right { top: 50px; right: 80px; }
      .dots-grid.bottom-center { bottom: 180px; left: 50%; transform: translateX(-50%); }
      .diagonal-lines {
        width: 100px;
        height: 100px;
        background-image: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 3px,
          white 3px,
          white 5px
        );
        animation: float2 8s ease-in-out infinite;
      }
      .diagonal-lines.top-right { top: 80px; right: 120px; }
      .diagonal-lines.bottom-right { bottom: 120px; right: 60px; }
      .triangle { width: 0; height: 0; animation: float3 7s ease-in-out infinite; }
      .triangle.large {
        border-left: 40px solid transparent;
        border-right: 40px solid transparent;
        border-bottom: 60px solid white;
        top: 120px; left: 80px;
      }
      .triangle.small {
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 30px solid white;
        bottom: 200px; left: 120px;
      }
      .triangle.outline {
        border-left: 25px solid transparent;
        border-right: 25px solid transparent;
        border-bottom: 40px solid white;
        bottom: 80px; right: 200px;
        opacity: 0.6;
      }
      .circle {
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        animation: float1 9s ease-in-out infinite reverse;
      }
      .circle.large { width: 200px; height: 200px; top: 100px; right: 50px; }
      .circle.medium { width: 120px; height: 120px; bottom: 100px; left: 200px; }
      .circle.small { width: 80px; height: 80px; top: 50%; left: 40%; }
      @keyframes float1 {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        25% { transform: translateY(-10px) translateX(5px); }
        50% { transform: translateY(-5px) translateX(-8px); }
        75% { transform: translateY(8px) translateX(3px); }
      }
      @keyframes float2 {
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        33% { transform: translateY(-15px) translateX(8px) rotate(2deg); }
        66% { transform: translateY(10px) translateX(-5px) rotate(-1deg); }
      }
      @keyframes float3 {
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        50% { transform: translateY(-12px) translateX(6px) rotate(5deg); }
      }
      .blur-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(0.5px);
        z-index: 1;
      }
    `}</style>
  </div>
);

export default AnimatedBackground; 