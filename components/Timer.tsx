'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  onTick?: (timeLeft: number) => void;
}

export default function Timer({ duration, onTimeUp, isActive, onTick }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        onTick?.(newTime);
        
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp, onTick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / duration) * 100;

  const getTimerColor = () => {
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`h-5 w-5 ${getTimerColor()}`} />
      <span className={`font-mono text-lg font-semibold ${getTimerColor()}`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
