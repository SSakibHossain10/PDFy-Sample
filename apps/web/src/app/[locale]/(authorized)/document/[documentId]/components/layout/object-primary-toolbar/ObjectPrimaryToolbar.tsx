"use client";

import useDeviceSize from "@/hooks/useDeviceSize";
import usePopover from "@/hooks/usePopover";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import { useI18n } from "@/locales/client";
import BorderIcn from "@icons/doutone/border.svg";
import CloseIcn from "@icons/doutone/close-circle.svg";
import TextSpacingIcon from "@icons/text-sacing.svg";
import CircleFillIcn from "@public/icons/doutone/circle-fill.svg";
import CircleStrokeIcn from "@public/icons/doutone/circle-stroke.svg";
import FieldSettingsIcn from "@public/icons/doutone/field-settings.svg";
import LayerIcn from "@public/icons/doutone/layer.svg";
import MoreIcn from "@public/icons/doutone/more-dots.svg";
import NudgeIcn from "@public/icons/doutone/nudge.svg";
import OpacityIcn from "@public/icons/doutone/opacity.svg";
import PositionIcn from "@public/icons/doutone/position.svg";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import CanvasAudio from "../../../classes/CanvasAudio";
import CanvasCircle from "../../../classes/CanvasCircle";
import CanvasImage from "../../../classes/CanvasImage";
import CanvasIText from "../../../classes/CanvasIText";
import CanvasMarkerDrawingPath from "../../../classes/CanvasMarkerDrawingPath";
import CanvasPage from "../../../classes/CanvasPage";
import CanvasPath from "../../../classes/CanvasPath";
import CanvasPencilDrawingPath from "../../../classes/CanvasPencilDrawingPath";
import CanvasRect from "../../../classes/CanvasRect";
import CanvasSignatureText from "../../../classes/CanvasSignatureText";
import CanvasText from "../../../classes/CanvasText";
import CanvasTextbox from "../../../classes/CanvasTextbox";
import CanvasVideo from "../../../classes/CanvasVideo";
import CanvasFeildCheckbox from "../../../classes/form/CanvasFeildCheckbox";
import CanvasFeildInput from "../../../classes/form/CanvasFeildInput";
import CanvasFeildRadio from "../../../classes/form/CanvasFeildRadio";
import CanvasFeildSelect from "../../../classes/form/CanvasFeildSelect";
import CanvasFeildSelectMultiple from "../../../classes/form/CanvasFeildSelectMultiple";
import CanvasFeildTextarea from "../../../classes/form/CanvasFeildTextarea";
import { documentManager } from "../../../documentManager";
import { CanvasObject } from "../../../types/document";
import ObjectMoreActionsMenu from "../object-actions-menu/ObjectMoreActionsMenu";
import AddPage from "./AddPage";
import BorderStyleBar from "./BorderStyleBar";
import BackgroundColorBar from "./color/BackgroundColorBar";
import BackgroundColorPanel from "./color/BackgroundColorPanel";
import FillColorBar from "./color/FillColorBar";
import FillColorPanel from "./color/FillColorPanel";
import StrokeColorBar from "./color/StrokeColorBar";
import StrokeColorPanel from "./color/StrokeColorPanel";
import DeletePage from "./DeletePage";
import DuplicatePage from "./DuplicatePage";
import FieldSettingsPannel from "./field-settings/FieldSettingsPannel";
import FontFamilyBar from "./font-family/FontFamilyBar";
import FontFamilyPanel from "./font-family/FontFamilyPanel";
import FontSizeBar from "./FontSizeBar";
import LayerPanel from "./layer/LayerPanel";
import NudgeBar from "./NudgeBar";
import { default as OpacityBar } from "./OpacityBar";
import PositionPanel from "./position/PositionPanel";
import FontStyleBar from "./text-format/FontStyleBar";
import FontWeightBar from "./text-format/FontWeightBar";
import ListTypeBar from "./text-format/list-type/TextListTypeBar";
import TextAlignBar from "./text-format/text-align/TextAlignBar";
import TextLinethroughBar from "./text-format/TextLinethroughBar";
import TextUnderlineBar from "./text-format/TextUnderlineBar";
import TextUppercaseBar from "./text-format/TextUppercaseBar";
import TextSpacingBar from "./TextSpacingBar";

const ObjectPrimaryToolbar = ({ FontFamiliesProvider }: { FontFamiliesProvider: ReactNode }) => {
  const primaryToolbarPanelPopover = usePopover<HTMLDivElement>();

  const fontFamilyPopover = usePopover<HTMLDialogElement>();
  const fontSizePopover = usePopover<HTMLDialogElement>();
  const textSpacingPopover = usePopover<HTMLDialogElement>();
  const backgroundColorBarPopover = usePopover<HTMLDialogElement>();
  const backgroundColorPanelPopover = usePopover<HTMLDialogElement>();
  const fillColorBarPopover = usePopover<HTMLDialogElement>();
  const fillColorPanelPopover = usePopover<HTMLDialogElement>();
  const strokeColorBarPopover = usePopover<HTMLDialogElement>();
  const strokeColorPanelPopover = usePopover<HTMLDialogElement>();
  const borderStylePopover = usePopover<HTMLDialogElement>();
  const fieldSettingsPopover = usePopover<HTMLDialogElement>();
  const opacityPopover = usePopover<HTMLDialogElement>();
  const layerPopover = usePopover<HTMLDialogElement>();
  const positionPopover = usePopover<HTMLDialogElement>();
  const nudgeBarPopover = usePopover<HTMLDialogElement>();

  const objectMoreActionMenuPopoderData = usePopover<HTMLDialogElement>();

  const [activeObjType, setActiveObjType] = useState("" as CanvasObject["type"] | CanvasPage["type"]);

  const { sm } = useDeviceSize();

  const t = useI18n();

  const showPrimaryToolbar = () => {
    setActiveObjType(documentManager.currentCanvas.getActiveObject()?.type as CanvasObject["type"]);
    primaryToolbarPanelPopover.popoverRef.current.showPopover();
  };

  const hidePrimaryToolbar = () => {
    primaryToolbarPanelPopover.popoverRef.current.hidePopover();
    // hide nested popovers
    [
      fontFamilyPopover,
      fontSizePopover,
      textSpacingPopover,
      backgroundColorBarPopover,
      backgroundColorPanelPopover,
      fillColorBarPopover,
      fillColorPanelPopover,
      strokeColorBarPopover,
      strokeColorPanelPopover,
      borderStylePopover,
      fieldSettingsPopover,
      opacityPopover,
      layerPopover,
      positionPopover,
      nudgeBarPopover,
      objectMoreActionMenuPopoderData,
    ]
      .filter((popover) => popover.popoverRef.current?.matches(":popover-open"))
      .map((popover) => popover.popoverRef.current.hidePopover());
  };
  useEffect(() => {
    documentManager.on("selection:created", showPrimaryToolbar);
    documentManager.on("selection:updated", showPrimaryToolbar);
    documentManager.on("selection:cleared", hidePrimaryToolbar);

    return () => {
      documentManager.off("selection:created", showPrimaryToolbar);
      documentManager.off("selection:updated", showPrimaryToolbar);
      documentManager.off("selection:cleared", hidePrimaryToolbar);
    };
  }, []);

  const hideOthePopoversOnShowNewPopover = () => {
    const allPopovers = [
      fontFamilyPopover,
      fontSizePopover,
      textSpacingPopover,
      backgroundColorBarPopover,
      backgroundColorPanelPopover,
      fillColorBarPopover,
      fillColorPanelPopover,
      strokeColorBarPopover,
      strokeColorPanelPopover,
      borderStylePopover,
      fieldSettingsPopover,
      opacityPopover,
      layerPopover,
      positionPopover,
      nudgeBarPopover,
      objectMoreActionMenuPopoderData,
    ];
    const leftSidePopovers = [
      fontFamilyPopover,
      backgroundColorPanelPopover,
      fillColorPanelPopover,
      strokeColorPanelPopover,
      fieldSettingsPopover,
      layerPopover,
      positionPopover,
      objectMoreActionMenuPopoderData,
    ];
    const toolAnchorPopovers = [
      textSpacingPopover,
      borderStylePopover,
      opacityPopover,
      objectMoreActionMenuPopoderData,
    ];

    const hideOtherPopoversForMobile = (e: Event) => {
      //@ts-expect-error
      if (e.newState === "open") {
        allPopovers
          .filter(
            (popover) => popover.popoverRef.current !== e.target && popover.popoverRef.current?.matches(":popover-open")
          )
          .forEach((popover) => popover.popoverRef.current.hidePopover());
      }
    };
    const hideOtherLeftSidePopoversForDesktop = (e: Event) => {
      //@ts-expect-error
      if (e.newState === "open") {
        leftSidePopovers
          .filter(
            (popover) => popover.popoverRef.current !== e.target && popover.popoverRef.current?.matches(":popover-open")
          )
          .forEach((popover) => popover.popoverRef.current.hidePopover());
      }
    };
    const hideOtherToolAnchorPopoversForDesktop = (e: Event) => {
      //@ts-expect-error
      if (e.newState === "open") {
        toolAnchorPopovers
          .filter(
            (popover) => popover.popoverRef.current !== e.target && popover.popoverRef.current?.matches(":popover-open")
          )
          .forEach((popover) => popover.popoverRef.current.hidePopover());
      }
    };

    //for mobile
    if (window.innerWidth < 640) {
      allPopovers.forEach((popover) => {
        popover.popoverRef.current?.addEventListener("toggle", hideOtherPopoversForMobile);
      });
    }
    // for desktop
    else {
      leftSidePopovers.forEach((popover) => {
        popover.popoverRef.current?.addEventListener("toggle", hideOtherLeftSidePopoversForDesktop);
      });
      toolAnchorPopovers.forEach((popover) => {
        popover.popoverRef.current?.addEventListener("toggle", hideOtherToolAnchorPopoversForDesktop);
      });
    }

    const clearEventsOfHideOthePopoversOnShowNewPopover = () => {
      allPopovers.forEach((popover) => {
        popover.popoverRef.current?.removeEventListener("toggle", hideOtherPopoversForMobile);
      });
      leftSidePopovers.forEach((popover) => {
        popover.popoverRef.current?.removeEventListener("toggle", hideOtherLeftSidePopoversForDesktop);
      });
      toolAnchorPopovers.forEach((popover) => {
        popover.popoverRef.current?.removeEventListener("toggle", hideOtherToolAnchorPopoversForDesktop);
      });
    };

    return clearEventsOfHideOthePopoversOnShowNewPopover;
  };
  useEffect(() => {
    const clearEventsOfHideOthePopoversOnShowNewPopover = hideOthePopoversOnShowNewPopover();
    return () => clearEventsOfHideOthePopoversOnShowNewPopover();
  }, []);

  console.log("activeObjType", activeObjType);

  const {
    onTouchStart: spacingOnTouchStart,
    onTouchMove: spacingOnTouchMove,
    onTouchEndCapture: spacingOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => textSpacingPopover.popoverRef.current?.hidePopover(),
    layoutRef: textSpacingPopover.popoverRef,
  });

  const {
    onTouchStart: feildSettingsOnTouchStart,
    onTouchMove: feildSettingsOnTouchMove,
    onTouchEndCapture: feildSettingsOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => fieldSettingsPopover.popoverRef.current?.hidePopover(),
    layoutRef: fieldSettingsPopover.popoverRef,
  });

  const {
    onTouchStart: fontFamilyOnTouchStart,
    onTouchMove: fontFamilyOnTouchMove,
    onTouchEndCapture: fontFamilyOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => fontFamilyPopover.popoverRef.current?.hidePopover(),
    layoutRef: fontFamilyPopover.popoverRef,
  });

  const {
    onTouchStart: backgroundBarOnTouchStart,
    onTouchMove: backgroundBarOnTouchMove,
    onTouchEndCapture: backgroundBarOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => backgroundColorBarPopover.popoverRef.current?.hidePopover(),
    layoutRef: backgroundColorBarPopover.popoverRef,
  });

  const {
    onTouchStart: backgroundPanelOnTouchStart,
    onTouchMove: backgroundPanelOnTouchMove,
    onTouchEndCapture: backgroundPanelOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => backgroundColorPanelPopover.popoverRef.current?.hidePopover(),
    layoutRef: backgroundColorPanelPopover.popoverRef,
  });

  const {
    onTouchStart: fillBarOnTouchStart,
    onTouchMove: fillBarOnTouchMove,
    onTouchEndCapture: fillBarOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => fillColorBarPopover.popoverRef.current?.hidePopover(),
    layoutRef: fillColorBarPopover.popoverRef,
  });

  const {
    onTouchStart: fillPanelOnTouchStart,
    onTouchMove: fillPanelOnTouchMove,
    onTouchEndCapture: fillPanelOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => fillColorPanelPopover.popoverRef.current?.hidePopover(),
    layoutRef: fillColorPanelPopover.popoverRef,
  });

  const {
    onTouchStart: strokeBarOnTouchStart,
    onTouchMove: strokeBarOnTouchMove,
    onTouchEndCapture: strokeBarOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => strokeColorBarPopover.popoverRef.current?.hidePopover(),
    layoutRef: strokeColorBarPopover.popoverRef,
  });

  const {
    onTouchStart: strokePanelOnTouchStart,
    onTouchMove: strokePanelOnTouchMove,
    onTouchEndCapture: strokePanelOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => strokeColorPanelPopover.popoverRef.current?.hidePopover(),
    layoutRef: strokeColorPanelPopover.popoverRef,
  });

  const {
    onTouchStart: borderStyleOnTouchStart,
    onTouchMove: borderStyleOnTouchMove,
    onTouchEndCapture: borderStyleOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => borderStylePopover.popoverRef.current?.hidePopover(),
    layoutRef: borderStylePopover.popoverRef,
  });

  const {
    onTouchStart: opacityOnTouchStart,
    onTouchMove: opacityOnTouchMove,
    onTouchEndCapture: opacityOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => opacityPopover.popoverRef.current?.hidePopover(),
    layoutRef: opacityPopover.popoverRef,
  });

  const {
    onTouchStart: posiionOnTouchStart,
    onTouchMove: posiionOnTouchMove,
    onTouchEndCapture: posiionOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => positionPopover.popoverRef.current?.hidePopover(),
    layoutRef: positionPopover.popoverRef,
  });

  const {
    onTouchStart: layerOnTouchStart,
    onTouchMove: layerOnTouchMove,
    onTouchEndCapture: layerOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => layerPopover.popoverRef.current?.hidePopover(),
    layoutRef: layerPopover.popoverRef,
  });

  const {
    onTouchStart: nudgeOnTouchStart,
    onTouchMove: nudgeOnTouchMove,
    onTouchEndCapture: nudgeOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => nudgeBarPopover.popoverRef.current?.hidePopover(),
    layoutRef: nudgeBarPopover.popoverRef,
  });

  const {
    onTouchStart: moreActionsOnTouchStart,
    onTouchMove: moreActionsOnTouchMove,
    onTouchEndCapture: moreActionsOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => objectMoreActionMenuPopoderData.popoverRef.current?.hidePopover(),
    layoutRef: objectMoreActionMenuPopoderData.popoverRef,
  });

  return (
    <>
      {/* font-family-panel */}
      <dialog
        popover="manual"
        id={fontFamilyPopover.id}
        ref={fontFamilyPopover.popoverRef}
        onTouchStart={fontFamilyOnTouchStart}
        onTouchMove={fontFamilyOnTouchMove}
        onTouchEndCapture={fontFamilyOnTouchEndCapture}
        className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left bottom-0 sm:top-11 sm:bottom-11 font-family-panel-popover sm:open:[&~*>*>*>.font-family-popover-action-btn]:bg-forground/15 sx:max-h-[50vh] sm:h-[calc(100dvh-var(--layout-top-bar))] open:flex"
      >
        <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-0.75 w-10 rounded-full bg-primary-200/50" />

        <FontFamilyPanel myPopover={fontFamilyPopover} FontFamiliesProvider={FontFamiliesProvider} />
      </dialog>

      {/* background-panel */}
      <div
        className={`${[CanvasPage.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type].includes(activeObjType as any) ? "sm:has-[dialog:popover-open]:[&~*>*>*>.background-popover-action-btn]:bg-forground/15" : "hidden"}`}
      >
        <dialog
          popover="manual"
          id={backgroundColorPanelPopover.id}
          ref={backgroundColorPanelPopover.popoverRef}
          onTouchStart={backgroundPanelOnTouchStart}
          onTouchMove={backgroundPanelOnTouchMove}
          onTouchEndCapture={backgroundPanelOnTouchEndCapture}
          className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left bottom-0 sm:top-11 sm:bottom-11 background-panel-popover sx:max-h-[50vh] sm:h-[calc(100dvh-var(--layout-top-bar))] open:flex"
        >
          <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-0.75 w-10 rounded-full bg-primary-200/50" />

          <BackgroundColorPanel myPopover={backgroundColorPanelPopover} />
        </dialog>
      </div>

      {/* fill-panel */}
      <div
        className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasText.type, CanvasIText.type, CanvasTextbox.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasSignatureText.type].includes(activeObjType as any) ? "sm:has-[dialog:popover-open]:[&~*>*>*>.fill-popover-action-btn]:bg-forground/15" : "hidden"}`}
      >
        <dialog
          popover="manual"
          id={fillColorPanelPopover.id}
          ref={fillColorPanelPopover.popoverRef}
          onTouchStart={fillPanelOnTouchStart}
          onTouchMove={fillPanelOnTouchMove}
          onTouchEndCapture={fillPanelOnTouchEndCapture}
          className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left bottom-0 sm:top-11 sm:bottom-11 fill-panel-popover sx:max-h-[50vh] sm:h-[calc(100dvh-var(--layout-top-bar))] open:flex"
        >
          <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-0.75 w-10 rounded-full bg-primary-200/50" />

          <FillColorPanel myPopover={fillColorPanelPopover} />
        </dialog>
      </div>

      {/* stroke-panel */}
      <div
        className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type].includes(activeObjType as any) ? "sm:has-[dialog:popover-open]:[&~*>*>*>.stroke-popover-action-btn]:bg-forground/15" : "hidden"}`}
      >
        <dialog
          popover="manual"
          id={strokeColorPanelPopover.id}
          ref={strokeColorPanelPopover.popoverRef}
          onTouchStart={strokePanelOnTouchStart}
          onTouchMove={strokePanelOnTouchMove}
          onTouchEndCapture={strokePanelOnTouchEndCapture}
          className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left bottom-0 sm:top-11 sm:bottom-11 stroke-panel-popover sx:max-h-[50vh] sm:h-[calc(100dvh-var(--layout-top-bar))] open:flex"
        >
          <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-0.75 w-10 rounded-full bg-primary-200/50" />
          <StrokeColorPanel myPopover={strokeColorPanelPopover} />
        </dialog>
      </div>

      {/* position-panel */}
      <div
        className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasText.type, CanvasIText.type, CanvasTextbox.type, CanvasImage.type, CanvasVideo.type, CanvasAudio.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type, CanvasSignatureText.type].includes(activeObjType as any) ? "has-[dialog:popover-open]:[&~*>*>*>.position-popover-action-btn]:bg-forground/15" : "hidden"}`}
      >
        <dialog
          popover="manual"
          id={positionPopover.id}
          ref={positionPopover.popoverRef}
          onTouchStart={posiionOnTouchStart}
          onTouchMove={posiionOnTouchMove}
          onTouchEndCapture={posiionOnTouchEndCapture}
          className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left bottom-0 sm:top-11 sm:bottom-11 position-panel-popover"
        >
          <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />
          <PositionPanel myPopover={positionPopover} />
        </dialog>
      </div>

      {/* layer-panel */}
      <div
        className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasText.type, CanvasIText.type, CanvasTextbox.type, CanvasImage.type, CanvasVideo.type, CanvasAudio.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type, CanvasSignatureText.type].includes(activeObjType as any) ? "sm:has-[dialog:popover-open]:[&~*>*>*>.layer-popover-action-btn]:bg-forground/15" : "hidden"}`}
      >
        <dialog
          popover="manual"
          id={layerPopover.id}
          ref={layerPopover.popoverRef}
          onTouchStart={layerOnTouchStart}
          onTouchMove={layerOnTouchMove}
          onTouchEndCapture={layerOnTouchEndCapture}
          className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left bottom-0 sm:top-11 sm:bottom-11 layer-panel-popover sx:max-h-[50vh] sm:h-[calc(100dvh-var(--layout-top-bar))] open:flex"
        >
          <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-0.75 w-10 rounded-full bg-primary-200/50" />

          <LayerPanel myPopover={layerPopover} />
        </dialog>
      </div>

      {/* primary-toolbar */}
      <section
        popover="manual"
        id={primaryToolbarPanelPopover.id}
        ref={primaryToolbarPanelPopover.popoverRef}
        style={
          {
            anchorName: "--primary-toolbar",
          } as CSSProperties
        }
        className="sx:popover-animation-translate-from-bottom transition-discrete sm:transition-all sm:-translate-y-21.5 sm:open:translate-y-0 sm:open:starting:-translate-y-21.5 flex bottom-0 sm:top-[var(--layout-top-bar)] sm:position-area-bottom z-30 sx:w-full h-[var(--layout-bottom-bar)] sm:h-10 sm:shadow-lg bg-gr-multi-dark-revert sm:rounded-3xl sm:mt-0.5 primary-toolbar-popover"
      >
        <div className="grow flex items-center gap-2 pl-3 overflow-x-auto overflow-y-visible scrollbar-hidden">
          {/* field-settings */}
          <div
            className={`${[CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <dialog
              popover="manual"
              id={fieldSettingsPopover.id}
              ref={fieldSettingsPopover.popoverRef}
              onTouchStart={feildSettingsOnTouchStart}
              onTouchMove={feildSettingsOnTouchMove}
              onTouchEndCapture={feildSettingsOnTouchEndCapture}
              className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left bottom-0 sm:top-11 sm:bottom-11 field-settings-popover open:[&+*]:bg-forground/15 sx:max-h-[50vh] sm:h-[calc(100dvh-var(--layout-top-bar))] open:flex"
            >
              <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

              <FieldSettingsPannel myPopover={fieldSettingsPopover} activeObjType={activeObjType} />
            </dialog>
            {/* field settings popover btn */}
            <button
              aria-describedby="field-settings-tooltip"
              popoverTarget={fieldSettingsPopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: "--field-settings-anchor" } as CSSProperties}
            >
              <FieldSettingsIcn className="size-5" />
              <span className="sm:hidden text-2xs text-nowrap">Settings</span>
            </button>
          </div>

          {/* field-settings-tooltip */}
          <div
            id="field-settings-tooltip"
            className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
            style={{ positionAnchor: "--field-settings-anchor" } as CSSProperties}
          >
            <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
              Field settings
            </p>
          </div>

          {/* font-family */}
          <div
            className={`${[CanvasTextbox.type, CanvasSignatureText.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            {/* font family popover btn */}
            <button
              aria-describedby="font-family-tooltip"
              popoverTarget={fontFamilyPopover.popoverTarget}
              className="flex items-center justify-between h-9 w-30 sm:h-7 pl-3 pr-1 rounded-xl bg-forground/5 border border-forground/10 hover:bg-forground/10 active:text-primary-500 font-family-popover-action-btn hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: "--font-family-anchor" } as CSSProperties}
            >
              <FontFamilyBar parentPopover={primaryToolbarPanelPopover} /> <MdKeyboardArrowDown />
            </button>
            {/* font-family-tooltip */}
            <div
              id="font-family-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={
                {
                  positionAnchor: "--font-family-anchor",
                } as CSSProperties
              }
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Font family
              </p>
            </div>
          </div>

          {/* font-size */}
          <div
            className={`${[CanvasTextbox.type, CanvasSignatureText.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <FontSizeBar parentPopover={primaryToolbarPanelPopover} myPopover={fontSizePopover} />
          </div>

          {/* font-weight */}
          <div
            className={`${[CanvasTextbox.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <FontWeightBar parentPopover={primaryToolbarPanelPopover} />
          </div>

          {/* font-style */}
          <div
            className={`${[CanvasTextbox.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <FontStyleBar parentPopover={primaryToolbarPanelPopover} />
          </div>

          {/* text-align */}
          <div
            className={`${[CanvasTextbox.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <TextAlignBar parentPopover={primaryToolbarPanelPopover} />
          </div>

          {/* list-type */}
          <div className={`${[CanvasTextbox.type].includes(activeObjType as any) ? "" : "hidden"}`}>
            <ListTypeBar parentPopover={primaryToolbarPanelPopover} />
          </div>

          {/* text-underline */}
          <div className={`${[CanvasTextbox.type].includes(activeObjType as any) ? "" : "hidden"}`}>
            <TextUnderlineBar parentPopover={primaryToolbarPanelPopover} />
          </div>

          {/* text-linethrough */}
          <div className={`${[CanvasTextbox.type].includes(activeObjType as any) ? "" : "hidden"}`}>
            <TextLinethroughBar parentPopover={primaryToolbarPanelPopover} />
          </div>

          {/* text-uperase */}
          <div className={`${[CanvasTextbox.type].includes(activeObjType as any) ? "" : "hidden"}`}>
            <TextUppercaseBar parentPopover={primaryToolbarPanelPopover} />
          </div>

          {/* text-spacing-bar */}
          <div className={`${[CanvasTextbox.type].includes(activeObjType as any) ? "" : "hidden"}`}>
            <dialog
              popover="manual"
              id={textSpacingPopover.id}
              ref={textSpacingPopover.popoverRef}
              onTouchStart={spacingOnTouchStart}
              onTouchMove={spacingOnTouchMove}
              onTouchEndCapture={spacingOnTouchEndCapture}
              className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-top sm:popover-animation-opacity bottom-[var(--layout-bottom-bar)] sm:position-area-bottom sx:w-[calc(100dvw-12px)] sx:mb-1 sx:mx-1.5 sm:mt-2 text-spacing-bar-popover open:[&+*]:bg-forground/15"
              style={{ positionAnchor: textSpacingPopover.positionAnchor } as CSSProperties}
            >
              <span className="absolute sm:hidden top-1.25 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />
              <TextSpacingBar myPopover={textSpacingPopover} />
            </dialog>
            {/* text spacing popover btn */}
            <button
              aria-describedby="text-spacing-tooltip"
              popoverTarget={textSpacingPopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: textSpacingPopover.anchorName } as CSSProperties}
            >
              <TextSpacingIcon className="size-5" />
              <span className="sm:hidden text-2xs">Spacing</span>
            </button>
            {/* text-spacing-tooltip */}
            <div
              id="text-spacing-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: textSpacingPopover.anchorName } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Text spacing
              </p>
            </div>
          </div>

          {/* background-quick */}
          <div
            className={`${[CanvasPage.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <dialog
              popover="manual"
              id={backgroundColorBarPopover.id}
              ref={backgroundColorBarPopover.popoverRef}
              onTouchStart={backgroundBarOnTouchStart}
              onTouchMove={backgroundBarOnTouchMove}
              onTouchEndCapture={backgroundBarOnTouchEndCapture}
              className="popover-animation-translate-from-bottom popover-animation-opacity position-area-top w-[calc(100dvw-12px)] mb-1 mx-1 background-quick-popover open:[&+*]:bg-forground/15"
              style={{ positionAnchor: "--primary-toolbar" } as CSSProperties}
            >
              <span className="absolute sm:hidden top-1 left-[50%] -translate-x-[50%] h-0.75 w-10 rounded-full bg-primary-200/50" />

              <BackgroundColorBar
                myPopover={backgroundColorBarPopover}
                backgroundColorPanelPopover={backgroundColorPanelPopover}
              />
            </dialog>
            {/* background color popover btn */}
            <button
              aria-describedby="background-color-tooltip"
              popoverTarget={sm ? backgroundColorPanelPopover.popoverTarget : backgroundColorBarPopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 background-popover-action-btn hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: "--background-color-anchor" } as CSSProperties}
            >
              <FaCircle className="size-5 p-0.25" />
              <span className="sm:hidden text-2xs">Background</span>
            </button>
            {/* background-color-tooltip */}
            <div
              id="background-color-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: "--background-color-anchor" } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Background color
              </p>
            </div>
          </div>

          {/* fill-quick */}
          <div
            className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasText.type, CanvasIText.type, CanvasTextbox.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasSignatureText.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <dialog
              popover="manual"
              id={fillColorBarPopover.id}
              ref={fillColorBarPopover.popoverRef}
              onTouchStart={fillBarOnTouchStart}
              onTouchMove={fillBarOnTouchMove}
              onTouchEndCapture={fillBarOnTouchEndCapture}
              className="popover-animation-translate-from-bottom popover-animation-opacity position-area-top w-[calc(100dvw-12px)] mb-1 mx-1 fill-quick-popover open:[&+*]:bg-forground/15"
              style={{ positionAnchor: "--primary-toolbar" } as CSSProperties}
            >
              <span className="absolute sm:hidden top-1 left-[50%] -translate-x-[50%] h-0.75 w-10 rounded-full bg-primary-200/50" />

              <FillColorBar myPopover={fillColorBarPopover} fillColorPanelPopover={fillColorPanelPopover} />
            </dialog>
            {/* fill color popover btn */}
            <button
              aria-describedby="fill-color-tooltip"
              popoverTarget={sm ? fillColorPanelPopover.popoverTarget : fillColorBarPopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 fill-popover-action-btn hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: "--fill-color-anchor" } as CSSProperties}
            >
              <CircleFillIcn className="size-5" />
              <span className="sm:hidden text-2xs">{t("Color")}</span>
            </button>
            {/* fill-color-tooltip */}
            <div
              id="fill-color-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: "--fill-color-anchor" } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Fill color
              </p>
            </div>
          </div>

          {/* stroke-quick */}
          <div
            className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <dialog
              popover="manual"
              id={strokeColorBarPopover.id}
              ref={strokeColorBarPopover.popoverRef}
              onTouchStart={strokeBarOnTouchStart}
              onTouchMove={strokeBarOnTouchMove}
              onTouchEndCapture={strokeBarOnTouchEndCapture}
              className="popover-animation-translate-from-bottom popover-animation-opacity position-area-top w-[calc(100dvw-12px)] mb-1 mx-1 stroke-quick-popover open:[&+*]:bg-forground/15"
              style={{ positionAnchor: "--primary-toolbar" } as CSSProperties}
            >
              <span className="absolute sm:hidden top-1 left-[50%] -translate-x-[50%] h-0.75 w-10 rounded-full bg-primary-200/50" />

              <StrokeColorBar myPopover={strokeColorBarPopover} strokeColorPanelPopover={strokeColorPanelPopover} />
            </dialog>
            {/* stroke color popover btn */}
            <button
              aria-describedby="stroke-color-tooltip"
              popoverTarget={sm ? strokeColorPanelPopover.popoverTarget : strokeColorBarPopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 stroke-popover-action-btn hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: "--stroke-color-anchor" } as CSSProperties}
            >
              <CircleStrokeIcn className="size-5" />
              <span className="sm:hidden text-2xs">{t("Stroke")}</span>
            </button>
            {/* stroke-color-tooltip */}
            <div
              id="stroke-color-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: "--stroke-color-anchor" } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Stroke color
              </p>
            </div>
          </div>

          {/* border-style */}
          <div
            className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type, CanvasSignatureText.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <dialog
              popover="manual"
              id={borderStylePopover.id}
              ref={borderStylePopover.popoverRef}
              onTouchStart={borderStyleOnTouchStart}
              onTouchMove={borderStyleOnTouchMove}
              onTouchEndCapture={borderStyleOnTouchEndCapture}
              className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-top sm:popover-animation-opacity bottom-[var(--layout-bottom-bar)] sm:position-area-bottom sx:w-[calc(100dvw-12px)] sx:mb-1 sx:mx-1.5 sm:mt-2 border-style-popover open:[&+*]:bg-forground/15"
              style={{ positionAnchor: borderStylePopover.positionAnchor } as CSSProperties}
            >
              <span className="absolute sm:hidden top-1.25 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />
              <BorderStyleBar myPopover={borderStylePopover} />
            </dialog>
            {/* border style popover btn */}
            <button
              aria-describedby="border-style-tooltip"
              popoverTarget={borderStylePopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: borderStylePopover.anchorName } as CSSProperties}
            >
              <BorderIcn className="size-5" />
              <span className="sm:hidden text-2xs">{t("Border")}</span>
            </button>
            {/* border-style-tooltip */}
            <div
              id="border-style-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: borderStylePopover.anchorName } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Border style
              </p>
            </div>
          </div>

          {/* transparency-bar */}
          <div
            className={`${[CanvasPage.type, CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasText.type, CanvasIText.type, CanvasTextbox.type, CanvasImage.type, CanvasVideo.type, CanvasAudio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type, CanvasSignatureText.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <dialog
              popover="manual"
              id={opacityPopover.id}
              ref={opacityPopover.popoverRef}
              onTouchStart={opacityOnTouchStart}
              onTouchMove={opacityOnTouchMove}
              onTouchEndCapture={opacityOnTouchEndCapture}
              className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-top sm:popover-animation-opacity bottom-[var(--layout-bottom-bar)] sm:position-area-bottom sx:w-[calc(100dvw-12px)] sx:mb-1 sx:mx-1.5 sm:mt-2 opacitybar-popover open:[&+*]:bg-forground/15"
              style={{ positionAnchor: opacityPopover.positionAnchor } as CSSProperties}
            >
              <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />
              <OpacityBar myPopover={opacityPopover} />
            </dialog>
            {/* transparency popover btn */}
            <button
              aria-describedby="transparency-tooltip"
              popoverTarget={opacityPopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: opacityPopover.anchorName } as CSSProperties}
            >
              <OpacityIcn className="size-5" />
              <span className="sm:hidden text-2xs">Transparency</span>
            </button>
            {/* transparency-tooltip */}
            <div
              id="transparency-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: opacityPopover.anchorName } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Transparency
              </p>
            </div>
          </div>

          {/* position popover btn */}
          <div
            className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasText.type, CanvasIText.type, CanvasTextbox.type, CanvasImage.type, CanvasVideo.type, CanvasAudio.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type, CanvasSignatureText.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <button
              aria-describedby="position-tooltip"
              popoverTarget={positionPopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 position-popover-action-btn hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: "--position-anchor" } as CSSProperties}
            >
              <PositionIcn className="size-5" />
              <span className="sm:hidden text-2xs">{t("Position")}</span>
            </button>
            {/* position-tooltip */}
            <div
              id="position-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: "--position-anchor" } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Position
              </p>
            </div>
          </div>

          {/* layer popover btn */}
          <div
            className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasText.type, CanvasIText.type, CanvasTextbox.type, CanvasImage.type, CanvasVideo.type, CanvasAudio.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type, CanvasSignatureText.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <button
              aria-describedby="layer-tooltip"
              popoverTarget={layerPopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 layer-popover-action-btn hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: "--layer-anchor" } as CSSProperties}
            >
              <LayerIcn className="size-5" />
              <span className="sm:hidden text-2xs">{t("Layer")}</span>
            </button>
            {/* layer-tooltip */}
            <div
              id="layer-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: "--layer-anchor" } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Layer
              </p>
            </div>
          </div>

          {/* nudge-bar */}
          <div
            className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasText.type, CanvasIText.type, CanvasTextbox.type, CanvasImage.type, CanvasVideo.type, CanvasAudio.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type, CanvasSignatureText.type].includes(activeObjType as any) ? "sm:hidden" : "hidden"}`}
          >
            <dialog
              popover="manual"
              id={nudgeBarPopover.id}
              ref={nudgeBarPopover.popoverRef}
              onTouchStart={nudgeOnTouchStart}
              onTouchMove={nudgeOnTouchMove}
              onTouchEndCapture={nudgeOnTouchEndCapture}
              className="popover-animation-translate-from-bottom popover-animation-opacity position-area-top w-[calc(100dvw-12px)] mb-1 mx-1.5 nudge-bar-popover open:[&+*]:bg-forground/15"
              style={{ positionAnchor: "--primary-toolbar" } as CSSProperties}
            >
              <span className="absolute top-1.25 left-[50%] -translate-x-[50%] h-0.75 w-10 rounded-full bg-primary-200/50" />
              <NudgeBar />
            </dialog>
            {/* nudge popover btn */}
            <button
              aria-describedby="nudge-tooltip"
              popoverTarget={nudgeBarPopover.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: "--nudge-anchor" } as CSSProperties}
            >
              <NudgeIcn className="size-6 -m-0.5" />
              <span className="text-2xs">{t("Nudge")}</span>
            </button>
            {/* nudge-tooltip */}
            <div
              id="nudge-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: "--nudge-anchor" } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                Nudge
              </p>
            </div>
          </div>

          {/* add page */}
          <div className={`${[CanvasPage.type].includes(activeObjType as any) ? "" : "hidden"}`}>
            <AddPage />
          </div>

          {/* duplicate page */}
          <div className={`${[CanvasPage.type].includes(activeObjType as any) ? "" : "hidden"}`}>
            <DuplicatePage />
          </div>

          {/* delete page */}
          <div className={`${[CanvasPage.type].includes(activeObjType as any) ? "" : "hidden"}`}>
            <DeletePage />
          </div>

          {/* more-panel */}
          <div
            className={`${[CanvasRect.type, CanvasCircle.type, CanvasPath.type, CanvasText.type, CanvasIText.type, CanvasTextbox.type, CanvasImage.type, CanvasVideo.type, CanvasAudio.type, CanvasFeildInput.type, CanvasFeildTextarea.type, CanvasFeildSelect.type, CanvasFeildSelectMultiple.type, CanvasFeildCheckbox.type, CanvasFeildRadio.type, CanvasPencilDrawingPath.type, CanvasMarkerDrawingPath.type, CanvasSignatureText.type].includes(activeObjType as any) ? "" : "hidden"}`}
          >
            <dialog
              popover="manual"
              ref={objectMoreActionMenuPopoderData.popoverRef}
              onTouchStart={moreActionsOnTouchStart}
              onTouchMove={moreActionsOnTouchMove}
              onTouchEndCapture={moreActionsOnTouchEndCapture}
              id={objectMoreActionMenuPopoderData.id}
              className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-top sx:w-full bottom-0 sm:position-area-bottom-right sm:position-fallbacks-bottom-right more-panel-popover sm:open:[&+*]:bg-forground/15"
              style={{ positionAnchor: objectMoreActionMenuPopoderData.positionAnchor } as CSSProperties}
            >
              <span className="absolute sm:hidden top-1.25 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />
              <ObjectMoreActionsMenu parentPopover={objectMoreActionMenuPopoderData} />
            </dialog>
            {/* more popover btn */}
            <button
              aria-describedby="more-tooltip"
              popoverTarget={objectMoreActionMenuPopoderData.popoverTarget}
              className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
              style={{ anchorName: objectMoreActionMenuPopoderData.anchorName } as CSSProperties}
            >
              <MoreIcn className="size-6 -m-0.5" />
              <span className="sm:hidden text-2xs">{t("More")}</span>
            </button>
            {/* more-tooltip */}
            <div
              id="more-tooltip"
              className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
              style={{ positionAnchor: objectMoreActionMenuPopoderData.anchorName } as CSSProperties}
            >
              <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
                More
              </p>
            </div>
          </div>
          <span className="grow pr-1" />
        </div>

        {/* close */}
        <CloseIcn
          role="button"
          aria-describedby="close-tooltip"
          className="sm:hidden shrink-0 size-11 p-1.5 mt-1 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: "--close-anchor" } as CSSProperties}
          onClick={() => {
            documentManager.currentCanvas.discardActiveObject();
            documentManager.currentCanvas.requestRenderAll();
          }}
        />
        {/* close-tooltip */}
        <div
          id="close-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
          style={{ positionAnchor: "--close-anchor" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Close
          </p>
        </div>
      </section>
    </>
  );
};

export default ObjectPrimaryToolbar;
