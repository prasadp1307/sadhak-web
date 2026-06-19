"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calculator, X, History, Trash2, Sun, Moon, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

export function CalculatorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [formula, setFormula] = useState("");
  const [isCalculated, setIsCalculated] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Initialize theme and history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("calc-dark-mode");
      if (savedTheme) {
        setIsDarkMode(savedTheme === "true");
      } else {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(systemPrefersDark);
      }

      const savedHistory = localStorage.getItem("calc-history");
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Failed to parse calculator history", e);
        }
      }
    }
  }, []);

  // Sync theme to localStorage and body/element level
  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("calc-dark-mode", String(newMode));
  };

  // Sync history to localStorage
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("calc-history", JSON.stringify(newHistory));
  };

  // Helper: check if decimal is allowed in current term
  const canAddDecimal = (expr: string): boolean => {
    const parts = expr.split(/[\s+\-×÷]+/);
    const lastPart = parts[parts.length - 1];
    return !lastPart.includes(".");
  };

  // Core Calculator Logic
  const handleDigit = (digit: string) => {
    if (isCalculated) {
      setDisplay(digit);
      setIsCalculated(false);
    } else {
      if (display === "0") {
        setDisplay(digit);
      } else {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    if (isCalculated) {
      setDisplay("0.");
      setIsCalculated(false);
    } else {
      if (canAddDecimal(display)) {
        setDisplay(display + ".");
      }
    }
  };

  const handleOperator = (op: string) => {
    if (isCalculated) {
      setFormula("");
      setIsCalculated(false);
    }

    const trimmed = display.trim();
    const lastChar = trimmed.slice(-1);

    if (["+", "-", "×", "÷"].includes(lastChar)) {
      // Replace last operator
      setDisplay(trimmed.slice(0, -1) + op);
    } else {
      setDisplay(display + " " + op + " ");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setFormula("");
    setIsCalculated(false);
  };

  const handleDelete = () => {
    if (isCalculated) {
      handleClear();
      return;
    }

    const trimmed = display.trim();
    if (trimmed.length <= 1 || trimmed === "Error" || trimmed.includes("Infinity")) {
      setDisplay("0");
    } else {
      // If deleting an operator with surrounding spaces
      if (trimmed.endsWith(" ")) {
        setDisplay(trimmed.slice(0, -3));
      } else {
        setDisplay(trimmed.slice(0, -1));
      }
    }
  };

  const handlePercentage = () => {
    if (isCalculated || display === "0" || display === "Error") return;

    // Get the last number segment in display to apply percentage
    const regex = /(\d+\.?\d*)$/;
    const match = display.match(regex);
    if (match) {
      const numStr = match[1];
      const percentVal = (parseFloat(numStr) / 100).toString();
      setDisplay(display.replace(regex, percentVal));
    }
  };

  const handleEvaluate = () => {
    if (isCalculated || display === "0" || display === "Error") return;

    let parsedExpr = display
      .replace(/×/g, "*")
      .replace(/÷/g, "/");

    // Clean up trailing operators
    parsedExpr = parsedExpr.trim();
    if (/[+\-*/]$/.test(parsedExpr)) {
      parsedExpr = parsedExpr.slice(0, -1).trim();
    }

    if (!parsedExpr) return;

    // Validate allowed characters for security
    if (!/^[0-9+\-*/. ]+$/.test(parsedExpr)) {
      setDisplay("Error");
      setIsCalculated(true);
      return;
    }

    try {
      // Safe evaluation
      const evaluate = new Function(`return (${parsedExpr})`);
      const result = evaluate();

      if (result === Infinity || result === -Infinity) {
        setDisplay("Error: Div by 0");
        setIsCalculated(true);
        return;
      }

      if (isNaN(result)) {
        setDisplay("Error");
        setIsCalculated(true);
        return;
      }

      // Limit decimal places and trim trailing zeros
      const formattedResult = Number(Number(result).toFixed(8)).toString();

      setFormula(display + " =");
      setDisplay(formattedResult);
      setIsCalculated(true);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression: display,
        result: formattedResult,
      };
      saveHistory([newHistoryItem, ...history.slice(0, 19)]);
    } catch (e) {
      setDisplay("Error");
      setIsCalculated(true);
    }
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard commands if input fields, contenteditable, or textareas have focus
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.hasAttribute("contenteditable") ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      // Only listen when calculator is expanded/open
      if (!isOpen) return;

      const key = e.key;

      if (/[0-9]/.test(key)) {
        e.preventDefault();
        handleDigit(key);
      } else if (key === ".") {
        e.preventDefault();
        handleDecimal();
      } else if (key === "+") {
        e.preventDefault();
        handleOperator("+");
      } else if (key === "-") {
        e.preventDefault();
        handleOperator("-");
      } else if (key === "*") {
        e.preventDefault();
        handleOperator("×");
      } else if (key === "/") {
        e.preventDefault();
        handleOperator("÷");
      } else if (key === "%") {
        e.preventDefault();
        handlePercentage();
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleEvaluate();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, display, isCalculated, history]);

  // Click handler for history items
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setDisplay(item.result);
    setFormula(item.expression + " =");
    setIsCalculated(true);
    setShowHistory(false);
  };

  // Clear all history
  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveHistory([]);
  };

  return (
    <div
      ref={widgetRef}
      className={cn(
        "mx-4 mb-4 rounded-xl border transition-all duration-300 overflow-hidden shadow-md select-none",
        isDarkMode
          ? "bg-stone-900 border-stone-800 text-stone-100"
          : "bg-white border-amber-200 text-stone-800",
        isOpen ? "max-h-[420px]" : "max-h-[52px] cursor-pointer hover:border-amber-400"
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
          <Calculator className={cn("h-4 w-4", isDarkMode ? "text-emerald-400" : "text-emerald-600")} />
          <span className="font-bold tracking-wide">Quick Calculator</span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          {isOpen && (
            <>
              {/* Theme Toggle */}
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

              {/* History Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHistory(!showHistory);
                }}
                title="View History"
                className={cn(
                  "p-1 rounded-md transition-colors",
                  showHistory
                    ? isDarkMode
                      ? "bg-stone-800 text-emerald-400"
                      : "bg-amber-200 text-emerald-800"
                    : isDarkMode
                    ? "hover:bg-stone-800 text-stone-400"
                    : "hover:bg-amber-100 text-stone-600"
                )}
              >
                <History className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          {/* Expand/Collapse Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
              setShowHistory(false);
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
        <div className="p-3 space-y-2 relative">
          
          {/* History Overlay Panel */}
          {showHistory && (
            <div
              className={cn(
                "absolute inset-0 z-20 flex flex-col p-3 transition-all",
                isDarkMode ? "bg-stone-900" : "bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-dashed border-stone-700/20">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">History</span>
                <div className="flex items-center space-x-2">
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-red-500 hover:text-red-600 p-0.5 rounded transition-colors"
                      title="Clear History"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-0.5 rounded hover:bg-stone-700/10 text-stone-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {history.length === 0 ? (
                  <p className="text-stone-500 italic text-center mt-8">No history yet</p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectHistoryItem(item)}
                      className={cn(
                        "p-2 rounded-lg cursor-pointer transition-all border text-right",
                        isDarkMode
                          ? "bg-stone-950/40 border-stone-800 hover:border-emerald-500/50"
                          : "bg-amber-50/50 border-amber-100 hover:border-emerald-500/50"
                      )}
                    >
                      <div className="text-[10px] text-stone-500 truncate">{item.expression}</div>
                      <div className={cn("font-bold text-sm", isDarkMode ? "text-emerald-400" : "text-emerald-700")}>
                        {item.result}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Display screen */}
          <div
            className={cn(
              "rounded-lg p-2.5 text-right font-mono flex flex-col justify-end min-h-[64px] transition-all",
              isDarkMode
                ? "bg-stone-950 border border-stone-800 text-stone-100"
                : "bg-amber-50/60 border border-amber-100 text-stone-800"
            )}
          >
            <div className="text-[11px] text-stone-400/80 min-h-[16px] truncate leading-tight">
              {formula}
            </div>
            <div className="text-xl font-bold truncate leading-tight mt-0.5">
              {display}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* Row 1 */}
            <button
              onClick={handleClear}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-red-950/20 text-red-400 border-red-900/30 hover:bg-red-950/40"
                  : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100/70"
              )}
            >
              C
            </button>
            <button
              onClick={handleDelete}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750"
                  : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
              )}
            >
              ⌫
            </button>
            <button
              onClick={handlePercentage}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750"
                  : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
              )}
            >
              %
            </button>
            <button
              onClick={() => handleOperator("÷")}
              className="py-2 rounded-lg font-bold text-xs transition-all active:scale-95 bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
            >
              ÷
            </button>

            {/* Row 2 */}
            <button
              onClick={() => handleDigit("7")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              7
            </button>
            <button
              onClick={() => handleDigit("8")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              8
            </button>
            <button
              onClick={() => handleDigit("9")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              9
            </button>
            <button
              onClick={() => handleOperator("×")}
              className="py-2 rounded-lg font-bold text-xs transition-all active:scale-95 bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
            >
              ×
            </button>

            {/* Row 3 */}
            <button
              onClick={() => handleDigit("4")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              4
            </button>
            <button
              onClick={() => handleDigit("5")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              5
            </button>
            <button
              onClick={() => handleDigit("6")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              6
            </button>
            <button
              onClick={() => handleOperator("-")}
              className="py-2 rounded-lg font-bold text-xs transition-all active:scale-95 bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
            >
              -
            </button>

            {/* Row 4 */}
            <button
              onClick={() => handleDigit("1")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              1
            </button>
            <button
              onClick={() => handleDigit("2")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              2
            </button>
            <button
              onClick={() => handleDigit("3")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              3
            </button>
            <button
              onClick={() => handleOperator("+")}
              className="py-2 rounded-lg font-bold text-xs transition-all active:scale-95 bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={() => handleDigit("0")}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border col-span-2",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className={cn(
                "py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border",
                isDarkMode
                  ? "bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700"
                  : "bg-stone-50 text-stone-800 border-stone-150 hover:bg-stone-150"
              )}
            >
              .
            </button>
            <button
              onClick={handleEvaluate}
              className="py-2 rounded-lg font-bold text-xs transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
            >
              =
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
