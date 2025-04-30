import { useSyncExternalStore } from "react";

type TDeviceSize = {
  sx: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  "2xl": boolean;
};

const useDeviceSize = (): TDeviceSize => {
  const deviceSize: TDeviceSize = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) as TDeviceSize;
  return deviceSize;
};

const deviceSize: TDeviceSize = {
  sx: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  "2xl": false,
};

function getSnapshot() {
  // console.log("getSnapshot");

  switch (true) {
    case document.documentElement.clientWidth >= 1536: //2xl
      deviceSize.sx = false;
      deviceSize.sm = true;
      deviceSize.md = true;
      deviceSize.lg = true;
      deviceSize.xl = true;
      deviceSize["2xl"] = true;
      break;
    case document.documentElement.clientWidth >= 1280: //xl
      deviceSize.sx = false;
      deviceSize.sm = true;
      deviceSize.md = true;
      deviceSize.lg = true;
      deviceSize.xl = true;
      deviceSize["2xl"] = false;
      break;
    case document.documentElement.clientWidth >= 1024: //lg
      deviceSize.sx = false;
      deviceSize.sm = true;
      deviceSize.md = true;
      deviceSize.lg = true;
      deviceSize.xl = false;
      deviceSize["2xl"] = false;
      break;
    case document.documentElement.clientWidth >= 768: //md
      deviceSize.sx = false;
      deviceSize.sm = true;
      deviceSize.md = true;
      deviceSize.lg = false;
      deviceSize.xl = false;
      deviceSize["2xl"] = false;
      break;
    case document.documentElement.clientWidth >= 640: //sm
      deviceSize.sx = false;
      deviceSize.sm = true;
      deviceSize.md = false;
      deviceSize.lg = false;
      deviceSize.xl = false;
      deviceSize["2xl"] = false;
      break;
    default: //sx
      deviceSize.sx = true;
      deviceSize.sm = false;
      deviceSize.md = false;
      deviceSize.lg = false;
      deviceSize.xl = false;
      deviceSize["2xl"] = false;
      break;
  }

  return deviceSize;
}

const serverDeviceSize: TDeviceSize = {
  sx: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  "2xl": false,
};

function getServerSnapshot() {
  // console.log("getServerSnapshot");
  return serverDeviceSize; // Always show "sx" for server-generated HTML
}

function subscribe(callback: () => void) {
  // console.log("subscribe");
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("resize", callback);
  };
}

export default useDeviceSize;
