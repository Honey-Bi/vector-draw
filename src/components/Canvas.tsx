import { useEffect, useRef, useState } from "react";
import {
  Tools,
  Position,
  KeyBind,
  Select,
  Size,
  SvgObject,
  Palette,
  SvgType,
  Color,
} from "../types";

type Props = {
  tool: Tools;
  setSelect: (select: Select) => void;
  keyBind: KeyBind;
  shortcutTool: (e: React.KeyboardEvent) => void;
  canvasSize: Size;
  svgList: React.MutableRefObject<SvgObject<SvgType>[]>;
  palette: Palette;
};

const ErrorMsg = {
  strokeNull: "선 색상이 선택되지 않았습니다..",
  fillStrokeNull: "선 또는 채우기 색상이 선택되지 않았습니다.",
  notYet: "준비 안됨",
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
  const canvasRef = useRef<SVGSVGElement>(null);
  const [isMouseOn, setMouseOn] = useState<boolean>(false);
  const [position, setPostion] = useState<Position>({ x: 0, y: 0 });
  const [cPosition, setCPosition] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  useEffect(() => {}, [position]);

  // 마우스 클릭 이벤트
  const MouseOnHandler = (e: React.MouseEvent) => {
    if (canvasRef.current && e.button === 0) {
      setMouseOn(true);
      const position = getPosition(e.pageX, e.pageY);
      setCPosition(getPosition(e.pageX, e.pageY));
      const id = svgList.current.length;
      var result: SvgObject<SvgType> | string = "";
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
          if (palette.stroke === null) {
            result = ErrorMsg["strokeNull"];
            break;
          }

          break;
        case "line": // complete
          if (palette.stroke === null) {
            result = ErrorMsg["strokeNull"];
            break;
          }
          result = {
            id: `${tool}-${id}`,
            title: tool,
            type: "line",
            property: {
              stroke: palette.stroke,
              strokeWidth: 2,
              position1: position,
              position2: position,
            },
          } as SvgObject<"line">;
          break;
        case "rect": // complete
          if (palette.fill === null && palette.stroke === null) {
            result = ErrorMsg["fillStrokeNull"];
            break;
          }
          result = {
            id: `${tool}-${id}`,
            title: tool,
            type: "rect",
            property: {
              fill: palette.fill,
              stroke: palette.stroke,
              strokeWidth: 2,
              position: position,
              size: { width: 0, height: 0 },
            },
          } as SvgObject<"rect">;
          break;
        case "circle": // complete
          if (palette.fill === null && palette.stroke === null) {
            result = ErrorMsg["fillStrokeNull"];
            break;
          }
          result = {
            id: `ellipse-${id}`,
            title: tool,
            type: "ellipse",
            property: {
              fill: palette.fill,
              stroke: palette.stroke,
              strokeWidth: 2,
              position: position,
              radius: { x: 0, y: 0 },
            },
          } as SvgObject<"ellipse">;
          break;
        case "shape":
          if (palette.fill === null && palette.stroke === null) {
            result = ErrorMsg["fillStrokeNull"];
            break;
          }
          break;
        case "path":
          result = ErrorMsg["strokeNull"];
          break;
        case "text":
          if (palette.fill === null && palette.stroke === null) {
            result = ErrorMsg["fillStrokeNull"];
            break;
          }
          result = {
            id: `text-${id}`,
            title: tool,
            type: "text",
            property: {
              fill: palette.fill,
              stroke: palette.stroke,
              strokeWidth: 2,
              fontSize: 10,
              position: position,
              content: "",
            },
          } as SvgObject<"text">;
          break;
        case "zoom": // complete
          zoomIO();
          return;
        case "spoid":
          return;
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
      let last = svgList.current[svgList.current.length - 1];
      switch (tool) {
        case "pencil": {
          // let tmp = last as SvgObject<"pencil">;
          // setPostion(position);
          break;
        }
        // complete
        case "line": {
          const tmp = last as SvgObject<"line">;
          tmp.property.position2 = position;
          break;
        }
        // complete
        case "rect": {
          const tmp = last as SvgObject<"rect">;
          if (position.x > cPosition.x) {
            // right
            tmp.property.size.width = position.x - cPosition.x;
          } else if (position.x < cPosition.x) {
            // left
            tmp.property.position.x = position.x;
            tmp.property.size.width = cPosition.x - position.x;
          }
          if (position.y > cPosition.y) {
            // bottom
            tmp.property.size.height = position.y - cPosition.y;
          } else {
            // top
            tmp.property.position.y = position.y;
            tmp.property.size.height = cPosition.y - position.y;
          }

          break;
        }
        case "circle":
          const tmp = last as SvgObject<"ellipse">;
          if (position.x > cPosition.x) {
            // right
            tmp.property.radius.x = (position.x - cPosition.x) / 2;
          } else if (position.x < cPosition.x) {
            // left
            tmp.property.radius.x = (cPosition.x - position.x) / 2;
          }
          if (position.y > cPosition.y) {
            // bottom
            tmp.property.radius.y = (position.y - cPosition.y) / 2;
          } else {
            // top
            tmp.property.radius.y = (cPosition.y - position.y) / 2;
          }

          tmp.property.position.x = (position.x + cPosition.x) / 2;
          tmp.property.position.y = (position.y + cPosition.y) / 2;
          break;
        case "shape":
          break;
        case "path":
          break;
        case "spoid":
          break;
      }
      setPostion(position);
    }
  };

  //마우스 클릭 종료 이벤트
  const MouseUpHandler = (e: React.MouseEvent) => {
    setMouseOn(false);
    if (tool !== "select") {
      // let last = svgList.current[svgList.current.length - 1];
    }
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
        case "pencil":
          result.push(<path key={index.id} id={index.id} />);
          break;
        // complete
        case "line": {
          const tmp = index as SvgObject<"line">;
          result.push(
            <line
              className={index.title}
              key={index.id}
              id={index.id}
              x1={tmp.property.position1.x}
              y1={tmp.property.position1.y}
              x2={tmp.property.position2.x}
              y2={tmp.property.position2.y}
              strokeWidth={tmp.property.strokeWidth}
              stroke={RGBtoHEX(tmp.property.stroke)}
            />
          );

          break;
        }
        // complete
        case "rect": {
          const tmp = index as SvgObject<"rect">;
          result.push(
            <rect
              className={index.title}
              key={index.id}
              id={index.id}
              x={tmp.property.position.x}
              y={tmp.property.position.y}
              width={tmp.property.size.width}
              height={tmp.property.size.height}
              fill={RGBtoHEX(tmp.property.fill)}
              stroke={RGBtoHEX(tmp.property.stroke)}
              strokeWidth={tmp.property.strokeWidth}
            />
          );
          break;
        }
        case "ellipse": {
          const tmp = index as SvgObject<"ellipse">;
          result.push(
            <ellipse
              className={index.title}
              key={index.id}
              id={index.id}
              cx={tmp.property.position.x}
              cy={tmp.property.position.y}
              rx={tmp.property.radius.x}
              ry={tmp.property.radius.y}
              strokeWidth={tmp.property.strokeWidth}
              fill={RGBtoHEX(tmp.property.fill)}
              stroke={RGBtoHEX(tmp.property.stroke)}
            />
          );
          break;
        }
        case "polygon":
          break;
        case "path":
          break;
        case "text": {
          const tmp = index as SvgObject<"text">;
          result.push(
            <text
              className={index.title}
              key={index.id}
              id={index.id}
              x={tmp.property.position.x}
              y={tmp.property.position.y}
              fontSize={tmp.property.fontSize}
              strokeWidth={tmp.property.strokeWidth}
              fill={RGBtoHEX(tmp.property.fill)}
              stroke={RGBtoHEX(tmp.property.stroke)}
            >
              {tmp.property.content}
            </text>
          );
          break;
        }
      }
    }
    return <>{result}</>;
  }

  function renderZoomList(): JSX.Element {
    let result = [];
    const zoomList = [
      25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500,
    ];
    for (let i of zoomList) {
      result.push(
        <li key={i} className="zoom-item" onMouseDown={() => setZoom(i / 100)}>
          {i}
        </li>
      );
    }
    return <ul className="zoom-list">{result}</ul>;
  }

  function getPosition(pageX: number, pageY: number): Position {
    let result = { x: 0, y: 0 };
    if (canvasRef.current) {
      const clientRect = canvasRef.current.getBoundingClientRect();
      result = {
        x: (pageX - clientRect.left) / zoom,
        y: (pageY - clientRect.top) / zoom,
      };
    }
    return result;
  }

  function zoomChange(e: React.ChangeEvent<HTMLInputElement>) {
    setZoom(Number(e.target.value) / 100);
  }

  function RGBtoHEX(color: Color): string {
    let result = "#";
    if (color) {
      for (let i of Object.values(color)) result += i.toString(16);
      return result;
    }
    return "none";
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
        <input
          type="number"
          className="zoom"
          min={1}
          value={Math.round(zoom * 100)}
          onChange={zoomChange}
        />
        {renderZoomList()}
      </div>
    </div>
  );
}
export default Canvas;
