import { useEffect, useRef, useState } from "react";
import { Tools, Position, KeyBind } from "../types";

type Props = {
  tool: Tools;
  setSelect: (select: SVGElement) => void;
  keyBind: KeyBind;
};

function Canvas({ tool, setSelect, keyBind }: Props) {
  const canvasRef = useRef<SVGSVGElement>(null);

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
