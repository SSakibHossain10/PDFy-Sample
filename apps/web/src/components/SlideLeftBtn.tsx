"use client";

import { useEffect, useRef, useState } from "react";
import { CiCircleChevLeft } from "react-icons/ci";
import { twMerge } from "tailwind-merge";

const SlideLeftBtn = ({ className }: { className?: string }) => {
  const [show, setShow] = useState(false);

  const sliderLeftEl = useRef<HTMLButtonElement>(null);

  const handleSlideLeft = () => {
    const sliderPerent = sliderLeftEl.current?.parentElement;
    if (sliderPerent) {
      sliderPerent.scrollLeft -= (sliderPerent.clientWidth / 5) * 4;
    }
  };

  useEffect(() => {
    const sliderPerent = sliderLeftEl.current?.parentElement;

    const handleShowHide = () => {
      if (sliderPerent) {
        if (sliderPerent.scrollLeft > 0) {
          setShow(true);
        } else {
          setShow(false);
        }
      }
    };

    handleShowHide();

    sliderPerent?.addEventListener("scrollend", handleShowHide);
    window.addEventListener("resize", handleShowHide);

    const observer = new ResizeObserver((entries) => {
      entries.slice(0, 1).forEach(() => {
        handleShowHide();
      });
    });
    if (sliderPerent) {
      observer.observe(sliderPerent);
    }

    return () => {
      sliderPerent?.removeEventListener("scrollend", handleShowHide);
      window.removeEventListener("resize", handleShowHide);
      observer.disconnect();
    };
  }, []);

  return (
    <button
      ref={sliderLeftEl}
      className={twMerge(
        "sx:hidden z-10 shrink-0 sticky left-0 top-0 bottom-0 w-0 overflow-visible -ml-4 transition-transform -translate-x-4.5 starting:-translate-x-12",
        className,
        show ? "block" : "hidden"
      )}
      onClick={handleSlideLeft}
    >
      <div
        className="h-full w-7 p-0.5 rounded-full bg-primary-50/10 hover:bg-primary-50/20 active:bg-primary-50/30 flex items-center"
        style={{ boxShadow: "0px 0px 10px 0px rgb(0 0 0 / 70%)" }}
      >
        <CiCircleChevLeft
          className="w-full h-auto text-primary-200 bg-primary-950/70 rounded-full"
          style={{ boxShadow: "0px 0px 15px 0px color-mix(in oklab, var(--color-black-950) 70%, transparent)" }}
        />
      </div>
    </button>
  );
};

export default SlideLeftBtn;
