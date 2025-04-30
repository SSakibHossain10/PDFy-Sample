import useTouchHold from "@/hooks/useTouchHold";
import MoveLeftIcn from "@icons/doutone/move-left.svg";
import { documentManager } from "../../../documentManager";

function NudgeBar() {
  const { handleholdStart: handleNudgeLeftTouchStart, handleholdEnd: handleNudgeLeftTouchend } = useTouchHold({
    holdInterval: 10,
    onHold: () => documentManager.nudgeObject("left"),
  });
  const { handleholdStart: handleNudgeUpTouchStart, handleholdEnd: handleNudgeUpTouchend } = useTouchHold({
    holdInterval: 10,
    onHold: () => documentManager.nudgeObject("up"),
  });
  const { handleholdStart: handleNudgeDownTouchStart, handleholdEnd: handleNudgeDownTouchend } = useTouchHold({
    holdInterval: 10,
    onHold: () => documentManager.nudgeObject("down"),
  });
  const { handleholdStart: handleNudgeRightTouchStart, handleholdEnd: handleNudgeRightTouchend } = useTouchHold({
    holdInterval: 10,
    onHold: () => documentManager.nudgeObject("right"),
  });

  const handleNudge = (nudgeTo: "left" | "right" | "up" | "down") => {
    documentManager.nudgeObject(nudgeTo);
  };

  return (
    <div className="w-full h-13 bg-gr-multi-dark sx:rounded-2xl sm:rounded-xl flex items-center gap-4 px-4 pt-1">
      <button
        className="grow-[2] flex justify-center rounded-lg active:text-primary-200 active:bg-primary-50/10"
        onClick={() => handleNudge("left")}
        onTouchStart={handleNudgeLeftTouchStart}
        onTouchEnd={handleNudgeLeftTouchend}
        onMouseDown={handleNudgeLeftTouchStart}
        onMouseUp={handleNudgeLeftTouchend}
      >
        <MoveLeftIcn className="size-8" />
      </button>

      <button
        className="grow py-1 flex justify-center rounded-lg active:text-primary-200 active:bg-primary-50/10"
        onClick={() => handleNudge("up")}
        onTouchStart={handleNudgeUpTouchStart}
        onTouchEnd={handleNudgeUpTouchend}
        onMouseDown={handleNudgeUpTouchStart}
        onMouseUp={handleNudgeUpTouchend}
      >
        <MoveLeftIcn className="size-8 rotate-90" />
      </button>

      <button
        className="grow py-1 flex justify-center rounded-lg active:text-primary-200 active:bg-primary-50/10"
        onClick={() => handleNudge("down")}
        onTouchStart={handleNudgeDownTouchStart}
        onTouchEnd={handleNudgeDownTouchend}
        onMouseDown={handleNudgeDownTouchStart}
        onMouseUp={handleNudgeDownTouchend}
      >
        <MoveLeftIcn className="size-8 -rotate-90" />
      </button>

      <button
        className="grow-[2] flex justify-center rounded-lg active:text-primary-200 active:bg-primary-50/10"
        onClick={() => handleNudge("right")}
        onTouchStart={handleNudgeRightTouchStart}
        onTouchEnd={handleNudgeRightTouchend}
        onMouseDown={handleNudgeRightTouchStart}
        onMouseUp={handleNudgeRightTouchend}
      >
        <MoveLeftIcn className="size-8 rotate-180" />
      </button>
    </div>
  );
}

export default NudgeBar;
