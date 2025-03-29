"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsAtive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsAtive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsAtive(true);
      setIsPaused(false);
    }
  };

  const handlePaused = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsAtive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsAtive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formateTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Countdown Timer
        </h1>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Enter Duration (in seconds)
          </label>
          <Input
            type="number"
            value={duration}
            onChange={handleDurationChange}
            placeholder="Enter seconds"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="mb-6">
          <Button
            onClick={handleSetDuration}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Set Duration
          </Button>
        </div>
        <div className="mb-8 text-center">
          <p className="text-6xl font-mono text-gray-900">{formateTime(timeLeft)}</p>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={handleStart}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md transition duration-200"
          >
            Start
          </Button>
          <Button
            onClick={handlePaused}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-md transition duration-200"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-md transition duration-200"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
