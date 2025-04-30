import { isEmpty } from "lodash";
import { RefObject, TouchEvent, useRef } from "react";

interface TScrollableElement extends HTMLElement {
  touch_start_scroll_top: number; // the scrollTop when touchStart to detect if scroll a bit in toucch move
  touch_start_scroll_left: number; // the scrollLeft when touchStart to detect if scroll a bit in toucch move
}

interface layoutRefType extends HTMLElement {
  touch_distance_from_top: number; // calc height & skip the distance
  touch_swiped: boolean; // onTouchEndCapture prevent final positioning if not swiped
  touch_swiping: boolean; // for ignoring oparations like setting height css variable on observer
  layout_fit_height: number; // need this when layout height is less then BASE_MAX_HEIGHT & LARGE_MAX_HEIGHT
  touch_start_from_scrollable_elements: TScrollableElement[] | []; // detect if user start swiping on a scrollable element
  is_touch_awaiting_for_request_animation: boolean; //prevent calling when await for requestanimation
  is_touch_scrolled_a_bit: boolean; //if user scrolled a bi then ignore swiping & let user scroll
}

const HEIGHT_FIT_CONTENT = `fit-content`;
const MIN_SWIPING_DISTANCE = 50;

const useTouchVerticalSwiper = ({
  LARGE_MAX_HEIGHT = "100svh",
  BASE_MAX_HEIGHT = "50vh",
  CLOSED_MAX_HEIGHT = "0px",
  SPACE_TO_TOP_IN_NUMBER = 44,
  layoutRef: layoutRefProp,
  resetHeightAfterClose = true,
  onSwipingClose,
}: {
  LARGE_MAX_HEIGHT?: string;
  BASE_MAX_HEIGHT?: string;
  CLOSED_MAX_HEIGHT?: string;
  SPACE_TO_TOP_IN_NUMBER?: number;
  layoutRef?: RefObject<HTMLElement>;
  onSwipingClose?: () => void;
  resetHeightAfterClose?: boolean;
}) => {
  // @ts-expect-error
  const defaultLayoutRef = useRef<layoutRefType>({
    touch_distance_from_top: 0,
    touch_swiped: false,
    touch_swiping: false,
    layout_fit_height: 0,
    touch_start_from_scrollable_elements: [],
    is_touch_awaiting_for_request_animation: false,
    is_touch_scrolled_a_bit: false,
  }) as RefObject<layoutRefType>;

  const layoutRef = (layoutRefProp as RefObject<layoutRefType>) || defaultLayoutRef;

  //disable transitions to make it smooth
  const disableTransition = () => {
    layoutRef.current.style.transition = "none";
  };

  //reset disabled transitions
  const enableTransition = () => {
    layoutRef.current.style.removeProperty("transition");
  };

  const getSwipingScrollableElements = (e: TouchEvent<HTMLElement>): TScrollableElement[] => {
    const touch_start_from_scrollable_elements: TScrollableElement[] = [];
    let target = e.target as HTMLElement | null;
    while (target && target !== layoutRef.current) {
      if (target && (target.scrollHeight > target.clientHeight || target.scrollWidth > target.clientWidth)) {
        (target as TScrollableElement).touch_start_scroll_top = target.scrollTop;
        (target as TScrollableElement).touch_start_scroll_left = target.scrollLeft;
        touch_start_from_scrollable_elements.push(target as TScrollableElement);
      }
      target = target.parentElement;
    }

    return touch_start_from_scrollable_elements;
  };

  const onTouchStart = (e: TouchEvent<HTMLElement>) => {
    // e.stopPropagation();
    disableTransition(); //remove transition as it prevent constant height change that make non smooth swiping
    layoutRef.current.touch_distance_from_top = layoutRef.current.offsetTop - e.touches[0].clientY;
    layoutRef.current.touch_swiped = false;
    layoutRef.current.layout_fit_height = layoutRef.current.offsetHeight;
    layoutRef.current.is_touch_scrolled_a_bit = false;
    layoutRef.current.touch_start_from_scrollable_elements = getSwipingScrollableElements(e);
  };

  const onTouchMove = (e: TouchEvent<HTMLElement>) => {
    e.stopPropagation();

    if (layoutRef.current.is_touch_scrolled_a_bit) return; //already scrolled a bit so ignore swiping
    if (layoutRef.current.is_touch_awaiting_for_request_animation) return; //already awaited for a requestAnimationFrame

    const doSwip = () => {
      layoutRef.current.touch_swiping = true;

      const SPACE_FROM_BOTTOM =
        document.documentElement.clientHeight - (layoutRef.current.offsetTop + layoutRef.current.offsetHeight);

      layoutRef.current.style.maxHeight = LARGE_MAX_HEIGHT;

      layoutRef.current.style.height = `${Math.max(
        0, //min-height
        Math.min(
          document.documentElement.clientHeight - SPACE_FROM_BOTTOM - SPACE_TO_TOP_IN_NUMBER, //max-height
          document.documentElement.clientHeight -
            e.touches[0].clientY -
            SPACE_FROM_BOTTOM -
            layoutRef.current.touch_distance_from_top
        )
      )}px`;

      layoutRef.current.touch_swiped = true;
    };

    if (!isEmpty(layoutRef.current.touch_start_from_scrollable_elements)) {
      layoutRef.current.is_touch_awaiting_for_request_animation = true;
      requestAnimationFrame(() => {
        //called 2 times as 1 time is not working
        requestAnimationFrame(() => {
          layoutRef.current.is_touch_awaiting_for_request_animation = false;
          //swiping start from a scrollable element
          if (
            layoutRef.current.touch_start_from_scrollable_elements &&
            layoutRef.current.touch_start_from_scrollable_elements.some(
              (scrollableElement) =>
                scrollableElement.scrollTop !== scrollableElement.touch_start_scroll_top ||
                scrollableElement.scrollLeft !== scrollableElement.touch_start_scroll_left
            )
          ) {
            layoutRef.current.is_touch_scrolled_a_bit = true; //scrolled a bit so ignore swiping
          } else {
            layoutRef.current.touch_start_from_scrollable_elements = []; //not scrolled a bit so consider as swiping
            doSwip();
          }
        });
      });
    } else {
      doSwip();
    }
  };

  const onTouchEndCapture = () => {
    const setFinalPosition = () => {
      layoutRef.current.touch_swiping = false;
      if (!layoutRef.current.touch_swiped) {
        enableTransition();
        return;
      }

      const SPACE_FROM_BOTTOM =
        document.documentElement.clientHeight - (layoutRef.current.offsetTop + layoutRef.current.offsetHeight);

      const offsetTop = document.documentElement.clientHeight - SPACE_FROM_BOTTOM - layoutRef.current.offsetTop;

      const BASE_MAX_HEIGHT_IN_NUMBER = document.documentElement.clientHeight / 2;

      const middleOrFitPosition = Math.min(BASE_MAX_HEIGHT_IN_NUMBER, layoutRef.current.layout_fit_height);

      const minSpaingDistance = Math.min(MIN_SWIPING_DISTANCE, layoutRef.current.layout_fit_height / 2);

      const doLargeView = () => {
        layoutRef.current.style.height = HEIGHT_FIT_CONTENT;
        layoutRef.current.style.maxHeight = LARGE_MAX_HEIGHT;
      };

      const doBaseView = () => {
        layoutRef.current.style.height = HEIGHT_FIT_CONTENT;
        layoutRef.current.style.maxHeight = BASE_MAX_HEIGHT;
      };

      const doClose = () => {
        layoutRef.current.style.height = HEIGHT_FIT_CONTENT;
        layoutRef.current.style.maxHeight = CLOSED_MAX_HEIGHT;
        onSwipingClose?.();
        if (resetHeightAfterClose) {
          layoutRef.current.style.height = HEIGHT_FIT_CONTENT;
          layoutRef.current.style.maxHeight = BASE_MAX_HEIGHT;
        }
      };

      //swiped to top
      if (layoutRef.current.layout_fit_height < offsetTop) {
        //to large view
        if (
          BASE_MAX_HEIGHT_IN_NUMBER < offsetTop &&
          layoutRef.current.layout_fit_height + minSpaingDistance < offsetTop
        ) {
          doLargeView();
        } //to base view
        else {
          doBaseView();
        }
      }
      //swiped to bottom
      else {
        //current large view
        if (layoutRef.current.layout_fit_height >= BASE_MAX_HEIGHT_IN_NUMBER) {
          //to close
          if (middleOrFitPosition - minSpaingDistance > offsetTop) {
            doClose();
          }
          //to large
          else if (layoutRef.current.layout_fit_height - minSpaingDistance < offsetTop) {
            doLargeView();
          }
          //to base
          else {
            doBaseView();
          }
        }
        //current base view
        else {
          //to close
          if (middleOrFitPosition - minSpaingDistance > offsetTop) {
            doClose();
          }
          //to base
          else {
            doBaseView();
          }
        }
      }

      enableTransition();
    };
    if (!isEmpty(layoutRef.current.touch_start_from_scrollable_elements)) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFinalPosition();
        });
      });
    } else {
      setFinalPosition();
    }
  };

  return {
    layoutRef,
    onTouchStart,
    onTouchMove,
    onTouchEndCapture,
  };
};

export default useTouchVerticalSwiper;
