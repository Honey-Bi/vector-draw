import { useEffect, useRef, useState } from "react";
import { Tools, Position, KeyBind } from "../types";

type Props = {
  tool: Tools;
  setSelect: (select: SVGElement) => void;
  keyBind: KeyBind;
};

function Canvas({ tool, setSelect, keyBind }: Props) {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [isMouseOn, setMouseOn] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    console.log(position);
  }, [position]);
  // 마우스 클릭 이벤트
  const MouseOnHandler = (e: React.MouseEvent) => {
    setMouseOn(true);
    switch (tool) {
      case "select":
        break;
    }
  };
  // 마우스 클릭 후 이동 이벤트
  const MouseMoveHandler = (e: React.MouseEvent) => {
    if (canvasRef.current && isMouseOn) {
      const clientRect = canvasRef.current.getBoundingClientRect();
      setPosition({
        x: e.pageX - clientRect.left,
        y: e.pageY - clientRect.top,
      });
    }
  };
  //마우스 클릭 종료 이벤트
  const MouseUpHandler = (e: React.MouseEvent) => {
    setMouseOn(false);
  };
  return (
    <div
      className={`canvas ${tool} 
        ${keyBind.ctrl ? "ctrl" : ""} 
        ${keyBind.alt ? "alt" : ""} 
        ${keyBind.shift ? "shift" : ""}`}
    >
      {/* <div className="ruler">
        <div className="horizontal"></div>
        <div className="vertical"></div>
      </div> */}
      <svg
        onMouseDown={MouseOnHandler}
        onMouseMove={MouseMoveHandler}
        onMouseUp={MouseUpHandler}
        width={800}
        height={800}
        ref={canvasRef}
      ></svg>
    </div>
  );
}
export default Canvas;
