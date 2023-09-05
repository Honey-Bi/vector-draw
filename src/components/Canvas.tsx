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
  Radius,
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

type mouseOn = {
  tool: boolean;
  resize: boolean;
  move: boolean;
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
  const defaultMouseOn: mouseOn = { tool: false, resize: false, move: false };
  const [isMouseOn, setMouseOn] = useState<mouseOn>(defaultMouseOn);
  const [position, setPostion] = useState<Position>({ x: 0, y: 0 });
  const [cPosition, setCPosition] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  useEffect(() => {}, [position]);

  const defaultData: { size: Size; position: Position; radius: Radius } = {
    size: { width: 0, height: 0 },
    position: { x: 0, y: 0 },
    radius: { rx: 0, ry: 0 },
  };

  // 마우스 클릭 이벤트
  const MouseOnHandler = (e: React.MouseEvent) => {
    if (canvasRef.current && e.button === 0) {
      // 마우스가 정상적으로 종료되지 않았을시 재실행 방지
      if (isMouseOn.tool || isMouseOn.resize || isMouseOn.move) return;

      const target = e.target as HTMLElement;
      // 크기변경 클릭
      if (target.classList.contains("resize")) {
        setMouseOn((prev) => ({ ...prev, resize: true }));
        return;
      }
      // 위치이동 클릭
      if (select?.includes(target.id)) {
        setMouseOn((prev) => ({ ...prev, move: true }));
        return;
      }

      // 도구 클릭
      setMouseOn((prev) => ({ ...prev, tool: true }));
      const position = getPosition(e.pageX, e.pageY);
      setCPosition(getPosition(e.pageX, e.pageY));
      const id = svgList.length;
      var result: SvgObject<SvgType> | string = "";
      switch (tool) {
        case "select":
          result = {
            id: "select",
            title: tool,
            type: "select",
            center: defaultData.position,
            property: {
              position: position,
              size: defaultData.size,
              fill: null,
              stroke: { r: 0, g: 102, b: 204 },
              strokeWidth: 2,
            },
          } as SvgObject<"rect">;

          if (target.id) {
            setSelect([target.id]);
          } else {
            setSelect(null);
          }
          break;
        case "pencil":
          if (palette.stroke === null) {
            result = ErrorMsg["strokeNull"];
            break;
          }
          result = {
            id: `pencil-${id}`,
            title: tool,
            type: "pencil",
            center: defaultData.position,
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
            center: defaultData.position,
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
            center: defaultData.position,
            property: {
              fill: palette.fill,
              stroke: palette.stroke,
              strokeWidth: palette.stroke ? 1 : 0,
              position: position,
              size: defaultData.size,
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
            center: defaultData.position,
            property: {
              fill: palette.fill,
              stroke: palette.stroke,
              strokeWidth: palette.stroke ? 1 : 0,
              position: position,
              radius: defaultData.radius,
            },
          } as SvgObject<"ellipse">;
          break;
        case "shape":
          if (palette.fill === null && palette.stroke === null) {
            result = ErrorMsg["fillStrokeNull"];
            break;
          }
          result = ErrorMsg["notYet"];
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
          result = ErrorMsg["notYet"];
          break;
        case "zoom":
          zoomIO();
          return;
        case "spoid":
          return;
      }
      if (typeof result === "string") {
        setMouseOn(defaultMouseOn);
        alert(result);
      } else {
        setSvgList([...svgList, result]);
      }
    }
  };

  // 마우스 클릭 후 이동 이벤트
  const MouseMoveHandler = (e: React.MouseEvent) => {
    if (canvasRef.current === null) return;

    const position = getPosition(e.pageX, e.pageY);
    if (isMouseOn.tool) {
      let last = svgList.at(-1);
      switch (tool) {
        case "pencil": {
          const tmp = last as SvgObject<"pencil">;
          tmp.property.path.push({
            c: "l",
            x: e.movementX / zoom,
            y: e.movementY / zoom,
          });
          break;
        }
        case "line": {
          const tmp = last as SvgObject<"line">;
          tmp.property.position2 = position;
          break;
        }
        case "select":
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
        case "circle": {
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
    } else if (isMouseOn.resize && select) {
    } else if (isMouseOn.move && select) {
      for (let id of select) {
        const type = id.split("-")[0] as SvgType;
        const index = Number(id.split("-").at(-1));
        switch (type) {
          case "pencil": {
            const tmp = svgList[index] as SvgObject<typeof type>;
            tmp.property.path[0].x! += e.movementX;
            tmp.property.path[0].y! += e.movementY;
            break;
          }
          case "line": {
            const tmp = svgList[index] as SvgObject<typeof type>;
            tmp.property.position1.x += e.movementX;
            tmp.property.position1.y += e.movementY;
            tmp.property.position2.x += e.movementX;
            tmp.property.position2.y += e.movementY;
            break;
          }
          case "ellipse":
          case "rect": {
            const tmp = svgList[index] as SvgObject<typeof type>;
            tmp.property.position.x += e.movementX;
            tmp.property.position.y += e.movementY;
            break;
          }
        }
      }
    }
    setPostion(position);
  };

  //마우스 클릭 종료 이벤트
  const MouseUpHandler = (e: React.MouseEvent) => {
    // canvas 내에서 클릭을시작하지 않았다면 중지
    if (!isMouseOn.tool && !isMouseOn.resize && !isMouseOn.move) return;

    let lastIndex = svgList.length - 1;
    let lastSelect = true;
    const position = getPosition(e.pageX, e.pageY); // 종료 커서 위치
    if (isMouseOn.tool) {
      switch (tool) {
        case "select":
          lastSelect = false;
          svgList.pop();
          let selectArray = [];
          for (let index of svgList) {
            if (
              Math.max(position.x, cPosition.x) >= index.center.x &&
              Math.min(position.x, cPosition.x) <= index.center.x &&
              Math.max(position.y, cPosition.y) >= index.center.y &&
              Math.min(position.y, cPosition.y) <= index.center.y
            )
              selectArray.push(index.id);
          }
          if (selectArray.length) {
            setSelect(selectArray);
          }
          break;
        case "pencil":
        case "line":
        case "rect":
        case "circle": {
          if (position.x === cPosition.x && position.y === cPosition.y) {
            setSelect(null);
            svgList.pop();
            lastSelect = false;
            break;
          }
          if (tool === "circle") {
            setHistory([
              ...history,
              ["create", "ellipse", lastIndex, svgList[lastIndex]],
            ]);
          } else {
            setHistory([...history, ["create", tool, lastIndex, svgList[lastIndex]]]);
          }
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
        case "zoom":
        case "spoid":
          lastSelect = false;
          break;
      }
      if (lastSelect) {
        let last = svgList[lastIndex];
        setSelect([last.id]);
      }
    } else if (isMouseOn.resize && select) {
    } else if (isMouseOn.move && select) {
    }
    setMouseOn(defaultMouseOn);
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
    const activeRectSize = 5;
    let result = [];
    result.push(
      <rect
        id={id}
        key={id}
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        fill="transparent"
        strokeWidth={1}
        strokeDasharray={4}
        className={`${select?.includes(id) ? "active" : ""}`}
        stroke={`${select?.includes(id) ? "#6fbeff" : "none"}`}
      />
    );
    // 선택되었지 않았을시
    if (!select || !select.includes(id)) return result;
    svgList[Number(id.split("-").at(-1))].center = {
      x: position.x + size.width / 2,
      y: position.y + size.height / 2,
    };
    const top = position.y - activeRectSize / 2;
    const middle = position.y + size.height / 2 - activeRectSize / 2;
    const bottom = position.y + size.height - activeRectSize / 2;
    const left = position.x - activeRectSize / 2;
    const center = position.x + size.width / 2 + activeRectSize / 2;
    const right = position.x + size.width - activeRectSize / 2;
    const positions = [
      { x: left, y: top }, // 7
      { x: center, y: top }, // 8
      { x: right, y: top }, // 9
      { x: left, y: middle }, // 4
      { x: right, y: middle }, // 6
      { x: left, y: bottom }, // 1
      { x: center, y: bottom }, // 2
      { x: right, y: bottom }, // 3
    ];

    result.push(
      <g fill="white" stroke="black" key={`${id}_resize`}>
        {positions.map((pos, i) => (
          <rect
            key={i}
            className="resize"
            width={activeRectSize}
            height={activeRectSize}
            x={pos.x}
            y={pos.y}
          />
        ))}
      </g>
    );
    return result;
  }

  // SVG Object list 랜더링 함수
  function renderSvgObject(): JSX.Element {
    let result = [];
    let rectPosition: Position;
    let rectSize: Size;
    for (let index of svgList) {
      switch (index.type) {
        case "select": {
          const tmp = index as SvgObject<"rect">;
          result.push(
            <rect
              key={index.id}
              x={tmp.property.position.x}
              y={tmp.property.position.y}
              width={tmp.property.size.width}
              height={tmp.property.size.height}
              fill="rgba(6, 106, 255, 0.2)"
              stroke={RGBtoHEX(tmp.property.stroke)}
              strokeWidth={tmp.property.strokeWidth}
            />
          );
          break;
        }
        case "pencil": {
          const tmp = index as SvgObject<typeof index.type>;
          let d = "";
          let pointX = tmp.property.path[0].x!;
          let pointY = tmp.property.path[0].y!;
          let minX = pointX,
            maxX = pointX,
            minY = pointY,
            maxY = pointY;
          let firstNo = true;
          for (let i of tmp.property.path) {
            d += " " + Object.values(i).join(" ");
            if (firstNo) {
              firstNo = false;
              continue;
            }
            pointX += i.x!;
            pointY += i.y!;
            minX = Math.min(minX, pointX);
            maxX = Math.max(maxX, pointX);
            minY = Math.min(minY, pointY);
            maxY = Math.max(maxY, pointY);
          }
          rectPosition = { x: minX, y: minY };
          rectSize = { width: maxX - minX, height: maxY - minY };
          result.push(
            <g key={index.id}>
              <path
                key={index.id}
                strokeWidth={tmp.property.strokeWidth}
                stroke={RGBtoHEX(tmp.property.stroke)}
                d={d + " "}
                fill="none"
              />
              {renderRect(index.id, rectPosition, rectSize)}
            </g>
          );
          break;
        }
        case "line": {
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
        case "rect": {
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
        case "ellipse": {
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

  // 캔버스 크기 스크린 크기에 맞춤 함수
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
