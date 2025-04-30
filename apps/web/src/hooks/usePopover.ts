import { RefObject, useId, useRef } from "react";

export type IPopover<T extends HTMLElement> = {
  popoverId: string;
  positionAnchor: string;
  id: string;
  anchorName: string;
  popoverTarget: string;
  popoverRef: RefObject<T>;
};

const usePopover = <T extends HTMLElement>() => {
  const popoverId = useId().slice(1, -1);

  const popoverRef = useRef<T>(null);

  const positionAnchor = `--popover-button-${popoverId}`;
  const id = `popover-${popoverId}`;
  const anchorName = `--popover-button-${popoverId}`;
  const popoverTarget = `popover-${popoverId}`;

  return {
    popoverId,
    positionAnchor,
    id,
    anchorName,
    popoverTarget,
    popoverRef,
  } as IPopover<T>;
};

export default usePopover;
