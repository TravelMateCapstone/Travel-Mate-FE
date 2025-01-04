import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
function CountdownTimer({ createdAt, duration = 3 * 60 * 1000 }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = duration - (now - new Date(createdAt));
      if (diff > 0) {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Đã quá hạn");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, duration]);

  return <span>{timeLeft}</span>;
}

export default CountdownTimer;
