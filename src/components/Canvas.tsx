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
  History,
} from "../types";

type Props = {
  tool: Tools;
  select: Select;
  setSelect: (select: Select) => void;
  keyBind: KeyBind;
  shortcutTool: (e: React.KeyboardEvent) => void;
  canvasSize: Size;
  palette: Palette;
  svgList: SvgObject<SvgType>[];
  setSvgList: (e: SvgObject<SvgType>[]) => void;
  history: History[];
  setHistory: (e: History[]) => void;
  setTmpHistory: (e: History[]) => void;
};

const ErrorMsg = {
  strokeNull: "선 색상이 선택되지 않았습니다..",
  fillStrokeNull: "선 또는 채우기 색상이 선택되지 않았습니다.",
  notYet: "준비 안됨",
};

function Canvas({
  tool,
  select,
  setSelect,
  keyBind,
  shortcutTool,
  canvasSize,
  palette,
  svgList,
  setSvgList,
  history,
  setHistory,
  setTmpHistory,
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
      if (isMouseOn) return; // 마우스가 정상적으로 종료되지 않았을시 새실행 방지
      setMouseOn(true);
      const position = getPosition(e.pageX, e.pageY);
      setCPosition(getPosition(e.pageX, e.pageY));
      const id = svgList.length;
      var result: SvgObject<SvgType> | string = "";
      switch (tool) {
        case "select":
          const target = e.target as Element;
          if (target.id) {
            setSelect(target.id);
          } else {
            setSelect(null);
          }
          return;
        case "pencil":
          if (palette.stroke === null) {
            result = ErrorMsg["strokeNull"];
            break;
          }
          result = {
            id: `pencil-${id}`,
            title: tool,
            type: "pencil",
            property: {
              stroke: palette.stroke,
              strokeWidth: 1,
              path: [{ c: "m", ...position }],
            },
          } as SvgObject<"pencil">;
          break;
        case "line":
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
        case "rect":
          if (palette.fill === null && palette.stroke === null) {
            result = ErrorMsg["fillStrokeNull"];
            break;
          }
          result = {
            id: `${tool}-${id}`,
            title: tool,
            type: "rect",
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            property: {
              fill: palette.fill,
              stroke: palette.stroke,
              strokeWidth: palette.stroke ? 1 : 0,
              position: position,
              size: { width: 0, height: 0 },
            },
          } as SvgObject<"rect">;
          break;
        case "circle":
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
              strokeWidth: palette.stroke ? 1 : 0,
              position: position,
              radius: { rx: 0, ry: 0 },
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
          result = ErrorMsg["notYet"];
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
        case "zoom":
          zoomIO();
          return;
        case "spoid":
          return;
      }
      if (typeof result === "string") {
        setMouseOn(false);
        alert(result);
      } else {
        setSvgList([...svgList, result]);
      }
    }
  };

  // 마우스 클릭 후 이동 이벤트
  const MouseMoveHandler = (e: React.MouseEvent) => {
    if (canvasRef.current && isMouseOn) {
      const position = getPosition(e.pageX, e.pageY);
      let last = svgList[svgList.length - 1];
      switch (tool) {
        case "pencil": /* complete */ {
          const tmp = last as SvgObject<"pencil">;
          tmp.property.path.push({
            c: "l",
            x: e.movementX / zoom,
            y: e.movementY / zoom,
          });
          break;
        }
        case "line": /* complete */ {
          const tmp = last as SvgObject<"line">;

          tmp.property.position2 = position;
          break;
        }
        case "rect": /* complete */ {
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
        case "circle": /* complete */ {
          const tmp = last as SvgObject<"ellipse">;
          if (position.x > cPosition.x) {
            // right
            tmp.property.radius.rx = (position.x - cPosition.x) / 2;
          } else if (position.x < cPosition.x) {
            // left
            tmp.property.radius.rx = (cPosition.x - position.x) / 2;
          }
          if (position.y > cPosition.y) {
            // bottom
            tmp.property.radius.ry = (position.y - cPosition.y) / 2;
          } else {
            // top
            tmp.property.radius.ry = (cPosition.y - position.y) / 2;
          }

          tmp.property.position.x = (position.x + cPosition.x) / 2;
          tmp.property.position.y = (position.y + cPosition.y) / 2;
          break;
        }
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
    if (!isMouseOn) return; // canvas 내에서 클릭을시작하지 않았다면 중지
    setMouseOn(false);
    let lastIndex = svgList.length - 1;
    let lastSelect = true;
    switch (tool) {
      case "pencil":
      case "line":
      case "rect": {
        setHistory([...history, ["create", tool, lastIndex, svgList[lastIndex]]]);
        setTmpHistory([]);
        break;
      }
      case "circle": {
        setHistory([...history, ["create", "ellipse", lastIndex, svgList[lastIndex]]]);
        setTmpHistory([]);
        break;
      }
      case "shape": {
        break;
      }
      case "path": {
        break;
      }
      case "text": {
        break;
      }
      case "select":
      case "zoom":
      case "spoid":
        lastSelect = false;
        break;
    }
    if (lastSelect) {
      let last = svgList[lastIndex];
      setSelect(last.id);
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

  function renderRect(id: string, position: Position, size: Size) {
    let add = [];
    const activeRectSize = 5;
    if (select && select === id) {
      add.push(
        <g fill="white" stroke="black">
          <rect
            strokeWidth={1}
            width={activeRectSize}
            height={activeRectSize}
            x={position.x - activeRectSize / 2}
            y={position.y - activeRectSize / 2}
          />
          {/* 7 */}
          <rect width={activeRectSize} height={activeRectSize} /> {/* 8 */}
          <rect width={activeRectSize} height={activeRectSize} /> {/* 9 */}
          <rect width={activeRectSize} height={activeRectSize} /> {/* 4 */}
          <rect width={activeRectSize} height={activeRectSize} /> {/* 6 */}
          <rect width={activeRectSize} height={activeRectSize} /> {/* 1 */}
          <rect width={activeRectSize} height={activeRectSize} /> {/* 2 */}
          <rect width={activeRectSize} height={activeRectSize} /> {/* 3 */}
        </g>
      );
    }
    return (
      <>
        <rect
          id={id}
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          fill="transparent"
          strokeWidth={1}
          {...(select ? (select === id ? { stroke: "#6fbeff" } : "") : "")}
        />
        {add}
      </>
    );
  }
  // SVG Object list 랜더링 함수
  function renderSvgObject(): JSX.Element {
    let result = [];
    let rectPosition: Position;
    let rectSize: Size;
    for (let index of svgList) {
      switch (index.type) {
        case "pencil": /* complete */ {
          const tmp = index as SvgObject<typeof index.type>;
          let d = "";
          for (let i of tmp.property.path) d += " " + Object.values(i).join(" ");

          result.push(
            <path
              key={index.id}
              id={index.id}
              strokeWidth={tmp.property.strokeWidth}
              stroke={RGBtoHEX(tmp.property.stroke)}
              d={d + " "}
              fill="none"
            />
          );
          break;
        }
        case "line": /* complete */ {
          const tmp = index as SvgObject<typeof index.type>;
          const minX = Math.min(tmp.property.position1.x, tmp.property.position2.x);
          const maxX = Math.max(tmp.property.position1.x, tmp.property.position2.x);
          const minY = Math.min(tmp.property.position1.y, tmp.property.position2.y);
          const maxY = Math.max(tmp.property.position1.y, tmp.property.position2.y);
          rectPosition = { x: minX, y: minY };
          rectSize = { width: maxX - minX, height: maxY - minY };
          result.push(
            <g key={index.id}>
              <line
                id={index.id}
                x1={tmp.property.position1.x}
                y1={tmp.property.position1.y}
                x2={tmp.property.position2.x}
                y2={tmp.property.position2.y}
                strokeWidth={tmp.property.strokeWidth}
                stroke={RGBtoHEX(tmp.property.stroke)}
              />
              {renderRect(index.id, rectPosition, rectSize)}
            </g>
          );

          break;
        }
        case "rect": /* complete */ {
          const tmp = index as SvgObject<typeof index.type>;
          rectPosition = tmp.property.position;
          rectSize = tmp.property.size;
          result.push(
            <g key={index.id}>
              <rect
                x={tmp.property.position.x}
                y={tmp.property.position.y}
                width={tmp.property.size.width}
                height={tmp.property.size.height}
                fill={RGBtoHEX(tmp.property.fill)}
                stroke={RGBtoHEX(tmp.property.stroke)}
                strokeWidth={tmp.property.strokeWidth}
              />
              {renderRect(index.id, rectPosition, rectSize)}
            </g>
          );
          break;
        }
        case "ellipse": /* complete */ {
          const tmp = index as SvgObject<typeof index.type>;

          rectPosition = {
            x: tmp.property.position.x - tmp.property.radius.rx,
            y: tmp.property.position.y - tmp.property.radius.ry,
          };
          rectSize = {
            width: tmp.property.radius.rx * 2,
            height: tmp.property.radius.ry * 2,
          };

          result.push(
            <g key={index.id}>
              <ellipse
                id={index.id}
                cx={tmp.property.position.x}
                cy={tmp.property.position.y}
                rx={tmp.property.radius.rx}
                ry={tmp.property.radius.ry}
                strokeWidth={tmp.property.strokeWidth}
                fill={RGBtoHEX(tmp.property.fill)}
                stroke={RGBtoHEX(tmp.property.stroke)}
              />
              {renderRect(index.id, rectPosition, rectSize)}
            </g>
          );
          break;
        }
        case "polygon":
          break;
        case "path":
          break;
        case "text": {
          const tmp = index as SvgObject<typeof index.type>;
          result.push(
            <text
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
    return (
      <svg
        viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
        width={canvasSize.width}
        height={canvasSize.height}
        ref={canvasRef}
      >
        {result}
      </svg>
    );
  }

  // 확대/축소 리스트 생성
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

  // 현재 마우스위치 가져오기
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

  // input 확대/축소 변경
  function zoomChange(e: React.ChangeEvent<HTMLInputElement>) {
    setZoom(Number(e.target.value) / 100);
  }

  // RGB 값 HEX로 변경 null 이면 "none" 반환
  function RGBtoHEX(color: Color): string {
    if (color) return `rgb(${color.r}, ${color.g}, ${color.b})`;
    return "none";
  }

  function fitScreen() {
    if (canvasRef.current) {
      const big = document.getElementsByClassName("canvas")[0].getBoundingClientRect();
      let big_min = Math.min(big.width, big.height);
      let small_max = Math.max(canvasSize.width * 1.1, canvasSize.height * 1.1);
      setZoom((big_min * 100) / small_max / 100);
    }
  }

  function shorcutZoom(e: React.KeyboardEvent) {
    if (e.ctrlKey && e.key === "1") setZoom(1);
    if (e.ctrlKey && e.key === "0") fitScreen();
  }

  // 키보드 단축키 처리
  function handleKeyDown(e: React.KeyboardEvent) {
    shortcutTool(e);
    shorcutZoom(e);
  }
  return (
    <div className="wrap">
      <div
        className={`canvas ${tool} 
        ${keyBind.ctrl ? "ctrl" : ""} 
        ${keyBind.alt ? "alt" : ""} 
        ${keyBind.shift ? "shift" : ""}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={MouseOnHandler}
        onMouseMove={MouseMoveHandler}
        onMouseUp={MouseUpHandler}
      >
        <div
          className="svg-canvas"
          style={{
            width: `${canvasSize.width * 1.1}px`,
            height: `${canvasSize.height * 1.1}px`,
            transform: `scale(${zoom})`,
          }}
        >
          {renderSvgObject()}
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
