import "./success.css";

const SuccessAnimation = () => {
  return (
    <div className="content">
      <svg className="svg-container" viewBox="0 0 400 400">
        <circle
          fill="none"
          stroke="#68E534"
          strokeWidth="20"
          cx="200"
          cy="200"
          r="190"
          strokeLinecap="round"
          transform="rotate(-90 200 200)"
          className="circle"
        />
        <polyline
          fill="none"
          stroke="#68E534"
          points="88,214 173,284 304,138"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="tick"
        />
      </svg>
    </div>
  );
};

export default SuccessAnimation;
