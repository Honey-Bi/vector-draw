import { useEffect, useRef, useState } from "react";
import {
  Tools,
  Position,
  KeyBind,
  Select,
  Size,
  SvgObject,
  Palette,
} from "../types";

type Props = {
  tool: Tools;
  setSelect: (select: Select) => void;
  keyBind: KeyBind;
  shortcutTool: (e: React.KeyboardEvent) => void;
  canvasSize: Size;
  svgList: React.MutableRefObject<SvgObject[]>;
  palette: Palette;
};

function Canvas({
  tool,
  setSelect,
  keyBind,
  shortcutTool,
  canvasSize,
  svgList,
  palette,
}: Props) {
const ErrorMsg = {
  strokeNull: "선 색상이 선택되지 않았습니다..",
  fillStrokeNull: "선 또는 채우기 색상이 선택되지 않았습니다.",
};
  const canvasRef = useRef<SVGSVGElement>(null);
  const [isMouseOn, setMouseOn] = useState<boolean>(false);
  const [position, setPostion] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  // const xmlns = "http://www.w3.org/2000/svg";

  useEffect(() => {}, [position]);

  // 마우스 클릭 이벤트
  const MouseOnHandler = (e: React.MouseEvent) => {
    setMouseOn(true);
    if (canvasRef.current) {
      const position = getPosition(e.pageX, e.pageY);
      const id = svgList.current.length;
      switch (tool) {
        case "select":
          const target = e.target as Element;
          if (target.id) {
            setSelect(e.target as SVGSVGElement);
          } else {
            setSelect(null);
          }
          return;
        case "pencil":
          const pencil: SvgObject = {
            title: `line-${id}`,
            type: "polyline",
            stroke: {
              r: palette.stroke!.r,
              g: palette.stroke!.g,
              b: palette.stroke!.b,
            },
            strokeWidth: 5,
            points: [position],
          };
          svgList.current.push(pencil);
          break;
        case "line":
          if (palette.stroke === null) {
            result = ErrorMsg["strokeNull"];
            break;
          }
          result = {
            title: `line-${id}`,
            type: "line",
            stroke: palette.stroke,
            strokeWidth: 5,
            position1: position,
            position2: position,
          };
          break;
        case "rect":
          if (palette.stroke === null && palette.fill === null) {
            result = ErrorMsg["fillStrokeNull"];
            break;
          }
          break;
        case "circle":
          break;
        case "shape":
          break;
        case "path":
          break;
        case "text":
          break;
        case "zoom":
          zoomIO();
          break;
        case "spoid":
          break;
      }
      if (typeof result === "string") {
        setMouseOn(false);
        alert(result);
      } else {
        svgList.current.push(result);
      }
    }
  };

  // 마우스 클릭 후 이동 이벤트
  const MouseMoveHandler = (e: React.MouseEvent) => {
    if (canvasRef.current && isMouseOn) {
      const position = getPosition(e.pageX, e.pageY);
      switch (tool) {
        case "line":
          svgList.current[svgList.current.length - 1].position2 = position;
          setPostion(position);
          break;
      }
    }
  };

  //마우스 클릭 종료 이벤트
  const MouseUpHandler = (e: React.MouseEvent) => {
    setMouseOn(false);
  };

  // 줌인 함수
  function zoomIO() {
    if (canvasRef.current) {
      const canvas = document.getElementsByClassName("canvas")[0];
      if (canvas.classList.contains("alt")) {
        setZoom((prev) => prev - 0.25);
      } else {
        setZoom((prev) => prev + 0.25);
      }
    }
  }

  // SVG Object list 랜더링 함수
  function renderSvgObject(): JSX.Element {
    let result = [];
    for (let index of svgList.current) {
      switch (index.type) {
        case "polyline":
          <polyline key={index.title} id={index.title} />;
          break;
        case "line":
          result.push(
            <line
              key={index.title}
              id={index.title}
              x1={index.position1!.x}
              y1={index.position1!.y}
              x2={index.position2!.x}
              y2={index.position2!.y}
              strokeWidth={index.strokeWidth!}
              stroke={`rgba(
                ${index.stroke!.r},
                ${index.stroke!.g},
                ${index.stroke!.b})`}
            />
          );

          break;
        case "rect":
          break;
        case "Ellipse":
          break;
        case "Polygon":
          break;
        case "path":
          break;
        case "text":
          break;
      }
    }
    return <>{result}</>;
  }

  function getPosition(pageX: number, pageY: number): Position {
    let result = { x: 0, y: 0 };
    if (canvasRef.current) {
      const clientRect = canvasRef.current.getBoundingClientRect();
      result = {
        x: pageX - clientRect.left,
        y: pageY - clientRect.top,
      };
    }
    return result;
  }

  return (
    <div className="wrap">
      <div
        className={`canvas ${tool} 
          ${keyBind.ctrl ? "ctrl" : ""} 
          ${keyBind.alt ? "alt" : ""} 
          ${keyBind.shift ? "shift" : ""}`}
        tabIndex={0}
        onKeyDown={shortcutTool}
        onMouseDown={MouseOnHandler}
        onMouseMove={MouseMoveHandler}
        onMouseUp={MouseUpHandler}
      >
        <div
          id="Canvas"
          className="svg-canvas"
          style={{
            width: `${canvasSize.width * 1.1}px`,
            height: `${canvasSize.height * 1.1}px`,
            transform: `scale(${zoom})`,
          }}
        >
          <svg
            viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
            width={canvasSize.width}
            height={canvasSize.height}
            ref={canvasRef}
          >
            {renderSvgObject()}
          </svg>
        </div>
      </div>
      <div className="canvas-footer">
        <div className="zoom">{zoom * 100}%</div>
      </div>
    </div>
  );
}
export default Canvas;
