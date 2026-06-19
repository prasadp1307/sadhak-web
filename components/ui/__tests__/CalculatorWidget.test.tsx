import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { CalculatorWidget } from "../CalculatorWidget";

// Set IS_REACT_ACT_ENVIRONMENT globally for React 18 testing
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

describe("CalculatorWidget", () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
  });

  it("should render collapsed widget correctly", () => {
    act(() => {
      const root = createRoot(container!);
      root.render(<CalculatorWidget />);
    });
    expect(container?.textContent).toContain("Quick Calculator");
  });
});
