"use client";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { CSSProperties, ReactNode, useEffect } from "react";
import { IDocumentPageParams } from "../page";
import "./styles/slot_styles.css";

const Layout = ({ children, params }: { children: ReactNode; params: IDocumentPageParams }) => {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const closeTabPanlel = async () => {
    router.replace(`/document/${(await params).documentId}/edit`);
  };

  const { layoutRef, onTouchStart, onTouchMove, onTouchEndCapture } = useTouchVerticalSwiper({
    BASE_MAX_HEIGHT: "50%",
    LARGE_MAX_HEIGHT: "calc(100% - var(--layout-bottom-bar) - 50px)",
    onSwipingClose: closeTabPanlel,
    resetHeightAfterClose: false,
  });

  useEffect(() => {
    //#reset height
    layoutRef.current.style.height = "fit-content";
    layoutRef.current.style.maxHeight = "50%";
  }, [segment]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (layoutRef.current?.touch_swiping) return; //skip if sliding
        document.documentElement.style.setProperty("--layout-tab-height", `${entry.contentRect.height}px`);
        document.documentElement.style.setProperty("--layout-tab-width", `${entry.contentRect.width}px`);
      }
    });

    if (layoutRef.current) {
      observer.observe(layoutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      data-tab-open={!!segment && segment !== "edit"}
      ref={layoutRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEndCapture={onTouchEndCapture}
      style={
        {
          height: "fit-content",
          maxHeight: "50%",
        } as CSSProperties
      }
      className={`${segment && segment !== "edit" ? "flex" : "hidden"} shrink-0 w-full sm:w-75 z-10 overflow-hidden document-tab-layout`}
    >
      {children}
    </section>
  );
};

export default Layout;
