import { useState, useEffect } from "react";

const Timer = ({ startTime, onTimeUpdate }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
      if (onTimeUpdate) {
        onTimeUpdate(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, onTimeUpdate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-md">
      <svg
        className="w-5 h-5 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="font-mono text-md font-semibold text-gray-800">
        {formatTime(elapsedTime)}
      </span>
    </div>
  );
};

export default Timer;
