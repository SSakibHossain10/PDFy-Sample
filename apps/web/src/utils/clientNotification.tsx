import usePopover from "@/hooks/usePopover";
import { useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { RiErrorWarningFill } from "react-icons/ri";
import { TbArrowBadgeRight } from "react-icons/tb";

type TClientNotificationType = "success" | "warn" | "error";

export type TClientNotificationOptions = {
  type?: TClientNotificationType;
  title: string;
  description?: string;
  duration?: number;
};

let root: Root | null;

const ClientNotificationComponent = (
  { renderKey, type = "success", title, description, duration = 5000 } = {} as TClientNotificationOptions & {
    renderKey: number;
  }
) => {
  const notificationPopover = usePopover<HTMLDialogElement>();

  const showNotification = () => notificationPopover.popoverRef.current?.showPopover();

  const closeNotification = () => notificationPopover.popoverRef.current?.hidePopover();

  useEffect(() => {
    if (notificationPopover.popoverRef.current.matches(":popover-open")) {
      //already have one opened //close it and show new one for animation
      closeNotification();
      setTimeout(() => {
        showNotification();
      }, 100);
    } else {
      showNotification();
    }
  }, [renderKey]);

  useEffect(() => {
    const closeNotificationTimeout = setTimeout(() => {
      closeNotification();
    }, duration);

    return () => {
      clearTimeout(closeNotificationTimeout);
    };
  }, [renderKey, duration]);

  return (
    <dialog
      id={notificationPopover.id}
      ref={notificationPopover.popoverRef}
      popover="manual"
      className={`popover-animation-translate-from-right transition-all duration-100 open:duration-300 transition-discrete top-(--header-height) right-0 w-fit ${type === "error" ? "bg-red-900/95" : type === "warn" ? "bg-yellow-900/95" : "bg-primary-900/95"} ${type === "error" ? "text-red-200" : type === "warn" ? "text-yellow-200" : "text-primary-200"} font-light border-l-8 ${type === "error" ? "border-red-600/95" : type === "warn" ? "border-yellow-600/95" : "border-primary-600/95"} shadow-lg`}
      style={{
        insetInlineStart: "unset",
        minWidth: "min(200px, 100dvw)",
        maxWidth: "min(400px, 100dvw)",
      }}
    >
      <div className="flex gap-1 pl-2.5 pr-1 py-2">
        {type === "error" ? (
          <RiErrorWarningFill className="shrink-0 size-4 mt-0.5 mr-2" />
        ) : type === "warn" ? (
          <IoIosWarning className="shrink-0 size-4 mt-0.5 mr-2" />
        ) : (
          <FaCircleCheck className="shrink-0 size-4 mt-0.5 mr-2" />
        )}

        <h6 className="grow text-sm font-normal">{title}</h6>
        <button
          popoverTarget={notificationPopover.popoverTarget}
          popoverTargetAction="hide"
          className={`p-1 rounded-lg hover:bg-forground/10 active:${type === "error" ? "text-red-500" : type === "warn" ? "text-yellow-500" : "text-primary-500"}`}
        >
          <TbArrowBadgeRight className="shrink-0 size-4.5" />
        </button>
      </div>
      {description && <p className="bg-background/15 px-2.5 py-2 border-r-4 border-inherit">{description}</p>}
    </dialog>
  );
};

const clientNotification = (notificationOptions = {} as TClientNotificationOptions) => {
  if (!notificationOptions.title) return; //no notification data provided

  if (!root) {
    const notificationPortalNode = document.getElementById("client-notification-portal") as HTMLElement;
    root = createRoot(notificationPortalNode);
  }

  root.render(<ClientNotificationComponent renderKey={Math.random()} {...notificationOptions} />);
};

export default clientNotification;
