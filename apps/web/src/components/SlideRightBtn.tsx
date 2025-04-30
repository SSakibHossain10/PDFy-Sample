"use client";

import { useEffect, useRef, useState } from "react";
import { CiCircleChevRight } from "react-icons/ci";
import { twMerge } from "tailwind-merge";

const SlideRightBtn = ({ className }: { className?: string }) => {
  const [show, setShow] = useState(false);

  const sliderRightEl = useRef<HTMLButtonElement>(null);

  const handleSlideRight = () => {
    const sliderPerent = sliderRightEl.current?.parentElement;
    if (sliderPerent) {
      sliderPerent.scrollLeft += (sliderPerent.clientWidth / 5) * 4;
    }
  };

  useEffect(() => {
    const sliderPerent = sliderRightEl.current?.parentElement;

    const handleShowHide = () => {
      if (sliderPerent) {
        if (sliderPerent.scrollWidth > sliderPerent.clientWidth + 1) {
          if (sliderPerent.scrollLeft < sliderPerent.scrollWidth - sliderPerent.clientWidth - 1) {
            setShow(true);
          } else {
            setShow(false);
          }
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
      ref={sliderRightEl}
      className={twMerge(
        "sx:hidden z-10 shrink-0 sticky right-0 top-0 bottom-0 w-0 overflow-visible -ml-4 transition-transform -translate-x-2.5 starting:translate-x-4.5",
        className,
        show ? "block" : "hidden"
      )}
      onClick={handleSlideRight}
    >
      <div
        className="h-full w-7 p-0.5 rounded-full bg-primary-50/10 hover:bg-primary-50/20 active:bg-primary-50/30 flex items-center"
        style={{ boxShadow: "0px 0px 10px 0px rgb(0 0 0 / 70%)" }}
      >
        <CiCircleChevRight
          className="w-full h-auto text-primary-200 bg-primary-950/70 rounded-full"
          style={{ boxShadow: "0px 0px 15px 0px color-mix(in oklab, var(--color-black-950) 70%, transparent)" }}
        />
      </div>
    </button>
  );
};

export default SlideRightBtn;
