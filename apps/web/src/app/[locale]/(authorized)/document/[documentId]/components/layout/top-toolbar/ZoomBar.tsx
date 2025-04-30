"use client";

import { useEffect, useState } from "react";

const ZoomBar = () => {
  const [zoomFactor, setZoomFactor] = useState(1);

  const handleChangeZoom = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const zoomFactor = Number(e.target.value);
    setZoomFactor(zoomFactor);
    document.documentElement.style.setProperty("--page-zoom-factor", `${zoomFactor}`);
  };

  const handleZoomKeys = (e: KeyboardEvent) => {
    if (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=")) {
      e.preventDefault(); // Prevent browser zoom

      setZoomFactor((prev) => {
        let newZoom = e.key === "+" || e.key === "=" ? prev + 0.1 : prev - 0.1;
        newZoom = Math.min(5, Math.max(0.5, newZoom)); // Keep zoom within limits
        document.documentElement.style.setProperty("--page-zoom-factor", `${newZoom}`);
        return newZoom;
      });
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleZoomKeys);
    return () => document.removeEventListener("keydown", handleZoomKeys);
  }, []);

  useEffect(() => {
    const handleCustomZoom = (e: CustomEvent) => {
      setZoomFactor((zoomFactor) => {
        const newZoom = Math.min(Math.max(zoomFactor * e.detail, 0.5), 5); // Clamp between 0.5 - 5
        document.documentElement.style.setProperty("--page-zoom-factor", `${newZoom}`);

        return newZoom;
      });
    };

    window.addEventListener("customZoom", handleCustomZoom as EventListener);
    return () => {
      window.removeEventListener("customZoom", handleCustomZoom as EventListener);
    };
  }, []);

  return (
    <div className="flex items-center gap-1 px-4">
      <input
        type="range"
        min={0.5}
        max={5}
        step={0.001}
        list="zoom-suggestions"
        value={zoomFactor}
        className="sx:hidden w-50 h-0.5 slider-thumb:mb-5 slider-thumb:border-[6px]"
        onChange={handleChangeZoom}
      />
      <datalist id="zoom-suggestions">
        {[1].map((zoom) => (
          <option key={zoom} value={zoom} />
        ))}
      </datalist>
      <select
        className="field-sizing-content appearance-none outline-0 text-xs px-2 py-1 hover:bg-forground/10 active:text-primary-500 rounded-lg cursor-pointer"
        value={zoomFactor}
        onChange={handleChangeZoom}
      >
        <option value={zoomFactor} className="hidden">
          {Math.round(zoomFactor * 100)}%
        </option>
        {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value) => (
          <option key={value} value={value} className="text-primary-600">
            {Math.round(value * 100)}%
          </option>
        ))}
      </select>
    </div>
  );
};

export default ZoomBar;
