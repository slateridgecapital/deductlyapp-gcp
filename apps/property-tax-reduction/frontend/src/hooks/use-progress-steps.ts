"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const STEPS: { label: string; targetPercent: number; atTimeMs: number }[] = [
  { label: "Validating address...", targetPercent: 8, atTimeMs: 0 },
  { label: "Searching property records...", targetPercent: 18, atTimeMs: 1500 },
  { label: "Retrieving tax assessment history...", targetPercent: 32, atTimeMs: 5000 },
  { label: "Pulling current market data...", targetPercent: 48, atTimeMs: 10000 },
  { label: "Analyzing comparable properties...", targetPercent: 62, atTimeMs: 16000 },
  { label: "Calculating tax rate...", targetPercent: 76, atTimeMs: 22000 },
  { label: "Computing potential savings...", targetPercent: 88, atTimeMs: 26000 },
  { label: "Finalizing your estimate...", targetPercent: 96, atTimeMs: 29000 },
];

const TOTAL_STEPS = STEPS.length;
const LERP_INTERVAL_MS = 100;
const FAST_FORWARD_STEP_MS = 500;

export function useProgressSteps() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [percent, setPercent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isBottlenecked, setIsBottlenecked] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const startTimeRef = useRef<number>(0);
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lerpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fastForwardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dataReady, setDataReady] = useState(false);
  const stoppedRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    stepTimersRef.current.forEach((t) => clearTimeout(t));
    stepTimersRef.current = [];
    if (lerpIntervalRef.current) {
      clearInterval(lerpIntervalRef.current);
      lerpIntervalRef.current = null;
    }
    if (fastForwardRef.current) {
      clearTimeout(fastForwardRef.current);
      fastForwardRef.current = null;
    }
  }, []);

  const clearStepAndLerpOnly = useCallback(() => {
    stepTimersRef.current.forEach((t) => clearTimeout(t));
    stepTimersRef.current = [];
    if (lerpIntervalRef.current) {
      clearInterval(lerpIntervalRef.current);
      lerpIntervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    clearAllTimers();
    setIsActive(false);
    setCurrentStepIndex(0);
    setPercent(0);
    setIsComplete(false);
    setIsBottlenecked(false);
    setDataReady(false);
  }, [clearAllTimers]);

  const markDataReady = useCallback(() => {
    setDataReady(true);
  }, []);

  const start = useCallback(() => {
    stoppedRef.current = false;
    setDataReady(false);
    clearAllTimers();
    startTimeRef.current = Date.now();
    setCurrentStepIndex(0);
    setPercent(0);
    setIsComplete(false);
    setIsBottlenecked(false);
    setIsActive(true);

    // Schedule step transitions based on atTimeMs
    stepTimersRef.current = STEPS.map((step, index) =>
      setTimeout(() => {
        if (stoppedRef.current) return;
        setCurrentStepIndex(index);
        if (index === TOTAL_STEPS - 1) {
          setIsBottlenecked(true);
        }
      }, step.atTimeMs)
    );

    // Smooth percent interpolation
    lerpIntervalRef.current = setInterval(() => {
      if (stoppedRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      let targetPercent = 0;
      for (let i = STEPS.length - 1; i >= 0; i--) {
        if (elapsed >= STEPS[i].atTimeMs) {
          targetPercent = STEPS[i].targetPercent;
          break;
        }
      }
      setPercent((p) => {
        const diff = targetPercent - p;
        if (Math.abs(diff) < 1) return targetPercent;
        return p + diff * 0.15;
      });
    }, LERP_INTERVAL_MS);

    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // When data is ready, stop the 30s timeline and fast-forward through remaining steps then complete
  useEffect(() => {
    if (!isActive || !dataReady) return;

    clearStepAndLerpOnly();

    if (currentStepIndex >= TOTAL_STEPS - 1) {
      setPercent(100);
      setIsBottlenecked(false);
      setIsComplete(true);
      clearAllTimers();
      return;
    }

    const nextIndex = currentStepIndex + 1;
    const advance = () => {
      if (stoppedRef.current) return;
      setCurrentStepIndex(nextIndex);
      setPercent(STEPS[nextIndex].targetPercent);
      if (nextIndex >= TOTAL_STEPS - 1) {
        setPercent(100);
        setIsComplete(true);
        clearAllTimers();
      } else {
        fastForwardRef.current = setTimeout(advance, FAST_FORWARD_STEP_MS);
      }
    };

    fastForwardRef.current = setTimeout(advance, FAST_FORWARD_STEP_MS);
    return () => {
      if (fastForwardRef.current) clearTimeout(fastForwardRef.current);
    };
  }, [isActive, dataReady, currentStepIndex, clearAllTimers, clearStepAndLerpOnly]);

  // Cleanup on unmount
  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

  return {
    start,
    stop,
    markDataReady,
    currentStepIndex,
    percent,
    isComplete,
    isBottlenecked,
    isActive,
    stepLabel: STEPS[currentStepIndex]?.label ?? "",
    totalSteps: TOTAL_STEPS,
  };
}
