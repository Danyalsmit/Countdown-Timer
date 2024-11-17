"use client";
import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
  // State to manage the duration input
  const [duration, setDuration] = useState<number | string>("");
  // State to manage the countdown timer value
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // State to track if the timer is active
  const [isActive, setIsActive] = useState<boolean>(false);
  // State to track if the timer is paused
  const [isPaused, setIsPaused] = useState<boolean>(false);
  // Reference to store the timer ID
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to handle setting the duration of the countdown
  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration); // Set the countdown timer
      setIsActive(false); // Reset active state
      setIsPaused(false); // Reset paused state
    }
  };

  // Function to start the countdown timer
  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  // Function to pause the countdown timer
  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
    }
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

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isActive, isPaused]);

  // Function to reset the countdown timer
  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0); // Reset the timer to the original duration
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Function to handleDurationChange the countdown timer
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): any => {
    setDuration(Number(e.target.value) || ""); // Update the duration state
  };

  // Function to format the time left into mm:ss format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = time % 60; // Calculate seconds
    // Return the formatted string
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="Container flex flex-col  justify-center items-center h-screen bg-gray-300 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="mb-4 flex justify-center font-semibold text-lg ">
          Countdown Timer
        </h1>
        <div className="flex gap-4">
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            onChange={(e) => handleDurationChange(e)}
            value={duration}
          />
          <Button
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
            onClick={handleSetDuration}
          >
            Set
          </Button>
        </div>
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
            onClick={handleStart}
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
            onClick={handlePause}
          >
            pause
          </Button>
          <Button
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
