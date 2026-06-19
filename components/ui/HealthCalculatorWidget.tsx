"use client";

import React, { useState, useEffect } from "react";
import { Activity, Sun, Moon, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function HealthCalculatorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [height, setHeight] = useState<string>("170"); // cm
  const [feet, setFeet] = useState<string>("5");       // ft
  const [inches, setInches] = useState<string>("7");   // in
  const [weight, setWeight] = useState<string>("65");  // kg
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("health-calc-dark-mode");
      if (savedTheme) {
        setIsDarkMode(savedTheme === "true");
      } else {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(systemPrefersDark);
      }
    }
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("health-calc-dark-mode", String(newMode));
  };

  // Convert unit change
  const handleUnitChange = (newUnit: "cm" | "ft") => {
    if (newUnit === heightUnit) return;

    if (newUnit === "ft") {
      // Convert cm to ft + in
      const cmVal = parseFloat(height);
      if (!isNaN(cmVal) && cmVal > 0) {
        const totalInches = cmVal / 2.54;
        const ftVal = Math.floor(totalInches / 12);
        const inVal = Math.round((totalInches % 12) * 10) / 10;
        setFeet(String(ftVal));
        setInches(String(inVal));
      }
    } else {
      // Convert ft + in to cm
      const ftVal = parseFloat(feet) || 0;
      const inVal = parseFloat(inches) || 0;
      const cmVal = ftVal * 30.48 + inVal * 2.54;
      if (cmVal > 0) {
        setHeight(String(Math.round(cmVal * 10) / 10));
      }
    }
    setHeightUnit(newUnit);
  };

  // Height and weight numbers
  const hNum = heightUnit === "cm"
    ? parseFloat(height)
    : (parseFloat(feet) || 0) * 30.48 + (parseFloat(inches) || 0) * 2.54;

  const wNum = parseFloat(weight);

  const hasValidInputs = !isNaN(hNum) && hNum > 0 && !isNaN(wNum) && wNum > 0;

  const bmi = hasValidInputs ? wNum / ((hNum / 100) * (hNum / 100)) : 0;
  const bmiFormatted = bmi > 0 ? bmi.toFixed(1) : "--";

  // Category classification
  let category = "Enter values";
  let badgeColor = "bg-stone-100 text-stone-600 border-stone-200";

  if (hasValidInputs && bmi > 0) {
    if (bmi < 18.5) {
      category = "Underweight";
      badgeColor = isDarkMode 
        ? "bg-sky-950/40 text-sky-400 border-sky-900/30" 
        : "bg-sky-50 text-sky-700 border-sky-100";
    } else if (bmi < 25) {
      category = "Normal Weight";
      badgeColor = isDarkMode 
        ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30" 
        : "bg-emerald-50 text-emerald-700 border-emerald-100";
    } else if (bmi < 30) {
      category = "Overweight";
      badgeColor = isDarkMode 
        ? "bg-amber-950/40 text-amber-400 border-amber-900/30" 
        : "bg-amber-50 text-amber-700 border-amber-100";
    } else {
      category = "Obese";
      badgeColor = isDarkMode 
        ? "bg-red-950/40 text-red-400 border-red-900/30" 
        : "bg-red-50 text-red-700 border-red-100";
    }
  }

  // Ideal weight range based on BMI 18.5 - 24.9
  const minIdeal = hasValidInputs ? (18.5 * ((hNum / 100) * (hNum / 100))).toFixed(1) : "--";
  const maxIdeal = hasValidInputs ? (24.9 * ((hNum / 100) * (hNum / 100))).toFixed(1) : "--";

  // Calculate pointer position on the visual BMI bar (range 15 to 35)
  const getPointerPosition = (bmiVal: number) => {
    if (bmiVal < 15) return 0;
    if (bmiVal > 35) return 100;
    
    if (bmiVal < 18.5) {
      return ((bmiVal - 15) / (18.5 - 15)) * 25;
    }
    if (bmiVal < 25) {
      return 25 + ((bmiVal - 18.5) / (25 - 18.5)) * 25;
    }
    if (bmiVal < 30) {
      return 50 + ((bmiVal - 25) / (30 - 25)) * 25;
    }
    return 75 + ((bmiVal - 30) / (35 - 30)) * 25;
  };

  const pointerPos = hasValidInputs ? getPointerPosition(bmi) : 0;

  return (
    <div
      className={cn(
        "mx-4 mb-4 rounded-xl border transition-all duration-300 overflow-hidden shadow-md select-none",
        isDarkMode
          ? "bg-stone-900 border-stone-800 text-stone-100"
          : "bg-white border-amber-200 text-stone-800",
        isOpen ? "max-h-[380px]" : "max-h-[52px] cursor-pointer hover:border-amber-400"
      )}
      onClick={() => !isOpen && setIsOpen(true)}
    >
      {/* Widget Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 font-semibold text-sm transition-colors",
          isOpen
            ? isDarkMode
              ? "bg-stone-950/40 border-b border-stone-800"
              : "bg-amber-50 border-b border-amber-100"
            : "bg-transparent"
        )}
      >
        <div className="flex items-center space-x-2">
          <Activity className={cn("h-4 w-4 animate-pulse", isDarkMode ? "text-emerald-400" : "text-emerald-600")} />
          <span className="font-bold tracking-wide">BMI Calculator</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {isOpen && (
            <button
              onClick={toggleTheme}
              title="Toggle local theme"
              className={cn(
                "p-1 rounded-md transition-colors",
                isDarkMode ? "hover:bg-stone-800 text-amber-400" : "hover:bg-amber-100 text-amber-600"
              )}
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={cn(
              "p-1 rounded-md transition-colors",
              isDarkMode ? "hover:bg-stone-800" : "hover:bg-amber-100"
            )}
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-3 space-y-3">
          {/* Inputs Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between h-5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Height</label>
                <div className="flex bg-stone-100 dark:bg-stone-950 p-0.5 rounded text-[9px] font-bold border border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => handleUnitChange("cm")}
                    className={cn(
                      "px-1.5 py-0.5 rounded transition-all",
                      heightUnit === "cm"
                        ? isDarkMode
                          ? "bg-stone-800 text-emerald-400"
                          : "bg-white text-emerald-700 shadow-sm"
                        : "text-stone-400 hover:text-stone-350"
                    )}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnitChange("ft")}
                    className={cn(
                      "px-1.5 py-0.5 rounded transition-all",
                      heightUnit === "ft"
                        ? isDarkMode
                          ? "bg-stone-800 text-emerald-400"
                          : "bg-white text-emerald-700 shadow-sm"
                        : "text-stone-400 hover:text-stone-350"
                    )}
                  >
                    ft
                  </button>
                </div>
              </div>

              {heightUnit === "cm" ? (
                <div className={cn(
                  "flex items-center rounded-md border transition-all focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500",
                  isDarkMode ? "bg-stone-950 border-stone-800" : "bg-amber-50/50 border-amber-150"
                )}>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    placeholder="cm"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-transparent px-2 py-1.5 text-sm font-medium outline-none border-none text-stone-800 dark:text-stone-100"
                  />
                  <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 pr-2 select-none">cm</span>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <div className={cn(
                    "flex-1 flex items-center rounded-md border transition-all focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500",
                    isDarkMode ? "bg-stone-950 border-stone-800" : "bg-amber-50/50 border-amber-150"
                  )}>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="ft"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      className="w-full bg-transparent pl-2 pr-1 py-1.5 text-sm font-medium outline-none border-none text-center text-stone-800 dark:text-stone-100"
                    />
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 pr-1.5 select-none">ft</span>
                  </div>
                  <div className={cn(
                    "flex-1 flex items-center rounded-md border transition-all focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500",
                    isDarkMode ? "bg-stone-950 border-stone-800" : "bg-amber-50/50 border-amber-150"
                  )}>
                    <input
                      type="number"
                      min="0"
                      max="11.9"
                      step="0.1"
                      placeholder="in"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      className="w-full bg-transparent pl-2 pr-1 py-1.5 text-sm font-medium outline-none border-none text-center text-stone-800 dark:text-stone-100"
                    />
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 pr-1.5 select-none">in</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center h-5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Weight</label>
              </div>
              <div className={cn(
                "flex items-center rounded-md border transition-all focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500",
                isDarkMode ? "bg-stone-950 border-stone-800" : "bg-amber-50/50 border-amber-150"
              )}>
                <input
                  type="number"
                  min="2"
                  max="500"
                  step="0.1"
                  placeholder="kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-transparent px-2 py-1.5 text-sm font-medium outline-none border-none text-stone-800 dark:text-stone-100"
                />
                <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 pr-2 select-none">kg</span>
              </div>
            </div>
          </div>

          {/* Results Screen */}
          <div
            className={cn(
              "rounded-lg p-2.5 flex items-center justify-between border",
              isDarkMode
                ? "bg-stone-950 border-stone-800"
                : "bg-amber-50/60 border-amber-100"
            )}
          >
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">BMI Score</span>
              <span className="text-2xl font-black font-mono leading-none tracking-tight block">
                {bmiFormatted}
              </span>
            </div>
            <div className="text-right space-y-1">
              <span className={cn("inline-block px-2 py-0.5 text-xs font-bold rounded-full border", badgeColor)}>
                {category}
              </span>
              {hasValidInputs && (
                <div className="text-[10px] text-stone-500">
                  Ideal: <span className="font-semibold">{minIdeal} - {maxIdeal} kg</span>
                </div>
              )}
            </div>
          </div>

          {/* Visual BMI Bar Indicator */}
          {hasValidInputs && (
            <div className="space-y-1.5 pt-1">
              <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-455 to-red-500 overflow-visible">
                {/* Pointer Knob */}
                <div
                  className="absolute -top-1 h-4 w-4 bg-emerald-600 dark:bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full shadow-md transition-all duration-300"
                  style={{ left: `calc(${pointerPos}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-bold text-stone-500 uppercase tracking-widest px-0.5">
                <span>15 (Under)</span>
                <span>25 (Normal)</span>
                <span>35 (Obese)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
