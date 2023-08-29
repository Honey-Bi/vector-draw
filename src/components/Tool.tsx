import React, { useState, useCallback, useRef, useEffect } from "react";
import { Color, Palette, Tools } from "../types";
import { ColorResult, SketchPicker } from "react-color";

type Props = {
  tool: Tools;
  setTool: (tools: Tools) => void;
  palette: Palette;
  setPalette: (color: Palette) => void;
  shortcutTool: (e: React.KeyboardEvent) => void;
};

export default function Tool({
  tool,
  setTool,
  palette,
  setPalette,
  shortcutTool,
}: Props) {
  const xmlns = "http://www.w3.org/2000/svg";

  const cpRef = useRef<HTMLDivElement>(null);

  const [FS, setFS] = useState<boolean>(true);
  // true 면 fill, false면 stroke

  // color picker 창 열려있는지
  const [open, setOpen] = useState<boolean>(false);

  // 채우기 색상 변경
  function colorFill() {
    if (!FS) return setFS(true);
    setColor(RGBtoHEX(palette.fill));
    setOpen(true);
  }

  // 선 색상 변경
  function colorStroke() {
    if (FS) return setFS(false);
    setColor(RGBtoHEX(palette.stroke));
    setOpen(true);
  }

  // 팔레트 기본 색상 기능
  function colorDefault() {
    setPalette({
      fill: { r: 255, g: 255, b: 255 },
      stroke: null,
    });
  }

  // 팔레트 스왑 기능
  function toggleFS() {
    setPalette({
      fill: palette.stroke,
      stroke: palette.fill,
    });
  }

  // 컬러피커 색상받을 상태변수
  const [color, setColor] = useState<string>("");

  const setPalleteColor = useCallback(
    (color: Color) => {
      if (FS) setPalette({ ...palette, fill: color });
      else setPalette({ ...palette, stroke: color });
    },
    [FS, palette, setPalette]
  );

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      setColor(color.hex);
      setPalleteColor(color.rgb);
    },
    [setPalleteColor]
  );

  function RGBtoHEX(color: Color): string {
    let result = "";
    if (color) {
      for (let i of Object.values(color)) result += i.toString(16);
      return result;
    }
    return "ffffff";
  }

  // 적당이 예쁘고 쓸모있는 색상들
  const customColors = [
    "#D0021B",
    "#F5A623",
    "#F8E71C",
    "#8B572A",
    "#7ED321",
    "#417505",
    "#BD10E0",
    "#9013FE",
    "#4A90E2",
    "#50E3C2",
    "#B8E986",
    "#000000",
    "#4A4A4A",
    "#9B9B9B",
    "#FFFFFF",
    { color: "#FFFFFF", title: "null" },
  ];

  const [selectNull, setSelectNull] = useState<boolean>(false);

  // 팔레트 닫기 및 빈 색상 변경
  useEffect(() => {
    // 외부영역 클릭 이벤트 감지후 팔레트 닫음
    const handleClick = (e: MouseEvent) => {
      if (cpRef.current && !cpRef.current.contains(e.target as Node)) {
        setOpen(false);
      }

      // title이 null인 custom colors 선택시
      const target = e.target as HTMLElement;
      if (target.getAttribute("title") === "null") {
        setSelectNull(true);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [cpRef]);

  // 빈 색상을 클릭후 빈색상에서 클릭이 종료되었을때
  useEffect(() => {
    const handleClickUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (selectNull && target.getAttribute("title") === "null") {
        setPalleteColor(null);
      }
      setSelectNull(false);
    };
    window.addEventListener("click", handleClickUp);
    return () => window.removeEventListener("click", handleClickUp);
  }, [selectNull, setPalleteColor]);

  return (
    <>
      <div className="tool" tabIndex={0} onKeyDown={shortcutTool}>
        <div
          className={`tool-button ${tool === "select" ? "active" : ""}`}
          title="Select Tool [V]"
          onClick={(e) => setTool("select")}
        >
          <svg viewBox="0 0 24 24">
            <path d="M17.15 20.76l-2.94 1.5-3.68-6-4.41 3V1.24l12.5 12.01-4.41 1.5 2.94 6z"></path>
          </svg>
        </div>
        <div
          className={`tool-button mirror ${tool === "pencil" ? "active" : ""}`}
          title="Pencil Tool [B]"
          onClick={() => setTool("pencil")}
        >
          <svg xmlns={xmlns} viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "line" ? "active" : ""}`}
          title="Line Tool [L]"
          onClick={() => setTool("line")}
        >
          <svg viewBox="0 0 27 27" xmlns={xmlns}>
            <path d="M 3 1 L 26 24 L 24 26 L 1 3 L 3 1 Z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "rect" ? "active" : ""}`}
          title="Square/Rect Tool [R]"
          onClick={() => setTool("rect")}
        >
          <svg viewBox="0 0 27 27" xmlns={xmlns}>
            <path d="M 0 8 L 0 24 L 24 24 L 25 8 L 0 8 Z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "circle" ? "active" : ""}`}
          title="Ellipse/Circle Tool [C]"
          onClick={() => setTool("circle")}
        >
          <svg viewBox="0 0 27 27" xmlns={xmlns}>
            <ellipse cx="13" cy="13" rx="13" ry="9"></ellipse>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "shape" ? "active" : ""}`}
          title="Shape Tool [U]"
          onClick={() => setTool("shape")}
        >
          <svg xmlns={xmlns} height="27" width="27" viewBox="0 0 24 24">
            <polygon points="14.43,10 12,2 9.57,10 2,10 8.18,14.41 5.83,22 12,17.31 18.18,22 15.83,14.41 22,10"></polygon>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "path" ? "active" : ""}`}
          title="Path Tool [P]"
          onClick={() => setTool("path")}
        >
          <svg xmlns={xmlns} viewBox="0 0 27 27">
            <path d="M12.2 1.9c0-.36.86 0 .86 0V14a1.3 1.3 0 10.88 0V1.9s.87-.36.87 0c0 6.81 5.22 11.68 5.22 11.68l-3.25 8.2h-6.55l-3.26-8.2s5.22-4.87 5.22-11.68zM7.83 25.26v-2.61h11.32v2.6H7.84z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "text" ? "active" : ""}`}
          title="Text Tool [T]"
          onClick={() => setTool("text")}
        >
          <svg xmlns={xmlns} viewBox="2 2 20 20">
            <path d="M5 4v3h5.5v12h3V7H19V4z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "zoom" ? "active" : ""}`}
          title="Zoom Tool [Z]"
          onClick={() => setTool("zoom")}
        >
          <svg xmlns={xmlns} viewBox="2 2 20 20">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </div>
        <div
          className={`tool-button mirror ${tool === "spoid" ? "active" : ""}`}
          title="Spoid Tool [I]"
          onClick={() => setTool("spoid")}
        >
          <svg xmlns={xmlns} viewBox="2 2 20 20">
            <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"></path>
          </svg>
        </div>
        <div className="tool-color">
          <div
            className={`color-fill 
              ${FS ? "active" : ""} 
              ${palette.fill === null ? "null" : ""}`}
            onClick={colorFill}
            style={{
              backgroundColor: `rgb(
                ${
                  palette.fill
                    ? `${palette.fill.r}, ${palette.fill.g}, ${palette.fill.b}`
                    : "255, 255, 255"
                })`,
            }}
          />
          <div
            className={`color-stroke 
              ${FS ? "" : "active"} 
              ${palette.stroke === null ? "null" : ""}`}
            onClick={colorStroke}
            style={{
              backgroundColor: `rgb(
                ${
                  palette.stroke
                    ? `${palette.stroke.r}, ${palette.stroke.g}, ${palette.stroke.b}`
                    : "255, 255, 255"
                })`,
            }}
          >
            <div className="fill" />
          </div>
          <div className="color-toggle" onClick={toggleFS}>
            <svg viewBox="0 0 490.011 490.011" transform="rotate(180)">
              <path d="M482.148,366.831l-97.6-88.6c-8.3-8.3-21.8-7.3-29.1,1c-8.3,8.3-7.3,21.9,1,29.2l57.8,52.1h-285v-286.2l51.9,58.1 c4.2,4.2,16.8,11,30.1,1c8.3-8.3,8.3-20.8,1-29.2l-88.2-98c-7.3-8.3-22.8-8.3-30.1,0l-88.2,98c-8.3,8.3-7.3,21.9,1,29.2 c8.3,8.3,21.8,7.3,29.1-1l51.9-58.1v306.1c0,11.5,9.3,20.8,20.8,20.8h307.1l-59,53.2c-8.3,8.3-8.3,20.8-1,29.2 c12.9,11.6,25.2,4.5,29.1,1l97.6-86.5C492.748,389.831,492.448,376.031,482.148,366.831z"></path>
            </svg>
          </div>
          <div className="color-default" onClick={colorDefault}>
            <svg viewBox="0 0 64 64" stroke="#000">
              <rect width="40" height="40" rx="3" />
              <rect x="20" y="20" width="40" height="40" rx="1" />
            </svg>
          </div>
          <div className={`color-picker ${open ? "open" : ""}`} ref={cpRef}>
            <SketchPicker
              width="300px"
              color={color}
              onChange={handleColorChange}
              presetColors={customColors}
            />
          </div>
        </div>
      </div>
    </>
  );
}
