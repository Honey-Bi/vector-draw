import React, { useEffect, useRef, useState } from "react";
import { Color, Palette, Position, Tools } from "../types";

type Props = {
  tool: Tools;
  setTool: (tools: Tools) => void;
  palette: Palette;
  setPalette: (color: Palette) => void;
  shortcutTool: (e: React.KeyboardEvent) => void;
};

type cpColor = {
  HEX: string | "null";
  RGB: string | "null";
  HSL: string | "null";
};

function Tool({ tool, setTool, palette, setPalette, shortcutTool }: Props) {
  const xmlns = "http://www.w3.org/2000/svg";

  const [FS, setFS] = useState<boolean>(true);
  // true 면 fill, false면 stroke

  const [open, setOpen] = useState<boolean>(false);

  const cpRef = useRef<HTMLDivElement>(null);
  const [sbDown, setSBDown] = useState<boolean>(false);
  const [cDown, setCDown] = useState<boolean>(false);
  const [cTop, setCTop] = useState<number>(0);
  const [sbPosition, setSBPosition] = useState<Position>({ x: 0, y: 0 });
  const [cpColor, setCPColor] = useState<cpColor>(setCPtoRGB(palette.fill));

  // 채우기 색상 변경
  function colorFill() {
    if (!FS) return setFS(true);
    setCPColor(setCPtoRGB(palette.fill));
    setOpen(true);
  }

  // 선 색상 변경
  function colorStroke() {
    if (FS) return setFS(false);
    setCPColor(setCPtoRGB(palette.stroke));
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
    setFS((prev) => !prev);
  }

  // 팔레트 닫기 기능
  useEffect(() => {
    // 외부영역 클릭 이벤트 감지후 팔레트 닫음
    const handleClick = (e: MouseEvent) => {
      if (cpRef.current && !cpRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [cpRef]);

  // 팔레트 색조정 마우스 이동 감지
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sbDown) {
        setSB(e.pageX, e.pageY);
      }
      if (cDown) {
        setC(e.pageY);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [sbDown, cDown]);

  // 팔레트 열고 마우스 업 감지
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (open) {
        setCDown(false);
        setSBDown(false);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [open]);

  // 색조 및 채도 클릭
  function sbMouseDown(e: React.MouseEvent) {
    setSBDown(true);
    setSB(e.pageX, e.pageY);
  }

  // 색상 변경 클릭
  function cMouseDown(e: React.MouseEvent) {
    setCDown(true);
    setC(e.pageY);
  }

  // 색조 및 채도 변경
  function setSB(x: number, y: number) {
    const sb = document.getElementsByClassName("sb")[0].getBoundingClientRect();
    const position: Position = {
      x: x - sb.x,
      y: y - sb.y,
    };
    if (position.x >= 0 && position.x <= 256)
      setSBPosition((prev) => {
        return { ...prev, x: position.x };
      });
    if (position.y >= 0 && position.y <= 256)
      setSBPosition((prev) => {
        return { ...prev, y: position.y };
      });
  }

  // 색상 변경
  function setC(y: number) {
    const c = document.getElementsByClassName("c")[0].getBoundingClientRect();
    const top = y - c.y;
    if (top > 256) setCTop(256);
    if (top < 0) setCTop(0);

    if (top >= 0 && top <= 256) {
      setCTop(top);
      const input_hsl = document.getElementById("HSL") as HTMLInputElement;
      let hsl_list = input_hsl.value.split(",");
      hsl_list[0] = Math.round((top / 256) * 360).toString();
      const cp = setCPtoHSL({
        h: Number(hsl_list[0]),
        s: Number(hsl_list[1]),
        l: Number(hsl_list[2]),
      });
      setCPColor(cp);
    }
  }

  // 컬러피커 rgb로 정보 입력
  function setCPtoRGB(color: Color): cpColor {
    if (color === null) return { HEX: "null", RGB: "null", HSL: "null" };
    const RGB = color.r + "," + color.g + "," + color.b;
    const HEX = RGBtoHex([color.r, color.g, color.b]);
    const HSL = RGBtoHSL(color.r, color.g, color.b).join(",");
    return { HEX: HEX, RGB: RGB, HSL: HSL };
  }

  // 컬러피커 hsl로 정보 입력
  function setCPtoHSL(color: { h: number; s: number; l: number } | null): cpColor {
    if (color === null) return { HEX: "null", RGB: "null", HSL: "null" };
    const HSL = color.h + "," + color.s + "," + color.l;
    const RGB = HSLtoRGB(color.h, color.s, color.l).join(",");
    const HEX = RGBtoHex(HSLtoRGB(color.h, color.s, color.l));
    return { HEX: HEX, RGB: RGB, HSL: HSL };
  }

  // 컬러피커 입력값 변경
  function cbChange(e: React.ChangeEvent<HTMLInputElement>, type: "HEX" | "RGB" | "HSL") {
    switch (type) {
      case "HEX":
        const length = e.target.value.length;
        let color: Color = null;
        // EX : #000
        if (length === 3) {
          let rgb: number[] = [];
          for (let i of e.target.value) {
            if (isNaN(parseInt(i, 16))) break; // 16진수 변환 가능확인
            rgb.push(parseInt(i + i, 16));
          }
          color = { r: rgb[0], g: rgb[1], b: rgb[2] };
        }

        // EX : #000000
        if (length === 6) {
          let rgb: number[] = [];
          for (let i = 0; i < length; i++) {
            if (i % 2 === 0) {
              let index = e.target.value.substring(i, i + 2); // 두글자씩 자르기
              if (isNaN(parseInt(index, 16))) break; // 16진수 변환 가능확인
              rgb.push(parseInt(index, 16));
            }
          }
          color = { r: rgb[0], g: rgb[1], b: rgb[2] };
        }
        if (color) {
          const cp = setCPtoRGB(color);
          setCPColor({ ...cp, HEX: e.target.value });
          return;
        }
        break;
      case "RGB":
        const rgb = e.target.value.split(",");
        // r,g,b 하나라도 없다면
        if (rgb.length !== 3) break;

        // r,g,b 숫자값이 아니라면
        let rgbError = false;
        for (let i of rgb) {
          if (i.trim() === "" || isNaN(Number(i))) {
            rgbError = true;
            break;
          }
        }
        if (rgbError) break;
        const rgb_cp = setCPtoRGB({ r: Number(rgb[0]), g: Number(rgb[1]), b: Number(rgb[2]) });
        setCPColor(rgb_cp);
        return;
      case "HSL":
        const hsl = e.target.value.split(",");
        // h,s,l 하나라도 없다면
        if (hsl.length !== 3) break;

        // h,s,l 숫자값이 아니거나
        let hslError = false;
        for (let i of hsl) {
          if (i.trim() === "" || isNaN(Number(i))) {
            hslError = true;
            break;
          }
        }
        // hsl 값에 못들어가는 값인지 확인
        if (Number(hsl[0]) > 360 || Number(hsl[0]) < 0) break;
        if (Number(hsl[1]) > 100 || Number(hsl[1]) < 0) break;
        if (Number(hsl[2]) > 100 || Number(hsl[2]) < 0) break;
        if (hslError) break;

        const hsl_cp = setCPtoHSL({ h: Number(hsl[0]), s: Number(hsl[1]), l: Number(hsl[2]) });
        setCPColor(hsl_cp);
        return;
    }

    setCPColor((prev) => {
      return { ...prev, [type]: e.target.value };
    });
  }

  // HSL 값을 RGB로
  function HSLtoRGB(h: number, s: number, l: number): number[] {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
  }

  // RGB 값을 HSL로
  function RGBtoHSL(r: number, g: number, b: number): number[] {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;
    return [
      Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
      Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
      Math.round((100 * (2 * l - s)) / 2),
    ];
  }

  function RGBtoHex(rgbArray: number[]): string {
    let hexList = [];
    for (let i of rgbArray) {
      let index = Math.round(i);
      if (Math.round(i) <= 16) hexList.push("0" + index.toString(16));
      else hexList.push(index.toString(16));
    }
    return hexList.join("");
  }

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
          onClick={(e) => setTool("pencil")}
        >
          <svg xmlns={xmlns} viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "line" ? "active" : ""}`}
          title="Line Tool [L]"
          onClick={(e) => setTool("line")}
        >
          <svg viewBox="0 0 27 27" xmlns={xmlns}>
            <path d="M 3 1 L 26 24 L 24 26 L 1 3 L 3 1 Z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "rect" ? "active" : ""}`}
          title="Square/Rect Tool [R]"
          onClick={(e) => setTool("rect")}
        >
          <svg viewBox="0 0 27 27" xmlns={xmlns}>
            <path d="M 0 8 L 0 24 L 24 24 L 25 8 L 0 8 Z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "circle" ? "active" : ""}`}
          title="Ellipse/Circle Tool [C]"
          onClick={(e) => setTool("circle")}
        >
          <svg viewBox="0 0 27 27" xmlns={xmlns}>
            <ellipse cx="13" cy="13" rx="13" ry="9"></ellipse>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "shape" ? "active" : ""}`}
          title="Shape Tool [U]"
          onClick={(e) => setTool("shape")}
        >
          <svg xmlns={xmlns} height="27" width="27" viewBox="0 0 24 24">
            <polygon points="14.43,10 12,2 9.57,10 2,10 8.18,14.41 5.83,22 12,17.31 18.18,22 15.83,14.41 22,10"></polygon>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "path" ? "active" : ""}`}
          title="Path Tool [P]"
          onClick={(e) => setTool("path")}
        >
          <svg xmlns={xmlns} viewBox="0 0 27 27">
            <path d="M12.2 1.9c0-.36.86 0 .86 0V14a1.3 1.3 0 10.88 0V1.9s.87-.36.87 0c0 6.81 5.22 11.68 5.22 11.68l-3.25 8.2h-6.55l-3.26-8.2s5.22-4.87 5.22-11.68zM7.83 25.26v-2.61h11.32v2.6H7.84z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "text" ? "active" : ""}`}
          title="Text Tool [T]"
          onClick={(e) => setTool("text")}
        >
          <svg xmlns={xmlns} viewBox="2 2 20 20">
            <path d="M5 4v3h5.5v12h3V7H19V4z"></path>
          </svg>
        </div>
        <div
          className={`tool-button ${tool === "zoom" ? "active" : ""}`}
          title="Zoom Tool [Z]"
          onClick={(e) => setTool("zoom")}
        >
          <svg xmlns={xmlns} viewBox="2 2 20 20">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </div>
        <div
          className={`tool-button mirror ${tool === "spoid" ? "active" : ""}`}
          title="Spoid Tool [I]"
          onClick={(e) => setTool("spoid")}
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
              backgroundColor: `rgba(
                ${palette.fill !== null ? palette.fill.r : 255},
                ${palette.fill !== null ? palette.fill.g : 255},
                ${palette.fill !== null ? palette.fill.b : 255})`,
            }}
          ></div>
          <div
            className={`color-stroke 
              ${FS ? "" : "active"} 
              ${palette.stroke === null ? "null" : ""}`}
            onClick={colorStroke}
            style={{
              backgroundColor: `rgba(
                ${palette.stroke !== null ? palette.stroke.r : 255},
                ${palette.stroke !== null ? palette.stroke.g : 255},
                ${palette.stroke !== null ? palette.stroke.b : 255})`,
            }}
          >
            <div className="fill" />
          </div>
          <div className="color-toggle" onClick={toggleFS}></div>
          <div className="color-default" onClick={colorDefault}></div>
        </div>
      </div>
      <div className={`color-picker ${open ? "open" : ""}`} ref={cpRef}>
        <div className="sb draggNone" onMouseDown={sbMouseDown}>
          <div className="arrow" style={{ top: sbPosition.y - 8, left: sbPosition.x - 8 }}></div>
        </div>
        <div className="c draggNone" onMouseDown={cMouseDown}>
          <div className="arrow" style={{ top: cTop }}></div>
        </div>
        <div className="info">
          <fieldset>
            <legend className="draggNone">COLOR</legend>
            <div
              className={`color ${cpColor.HEX === null ? "null" : ""}`}
              style={{ backgroundColor: `rgb(${cpColor.RGB})` }}
            />
          </fieldset>
          <fieldset>
            <legend className="draggNone">HEX</legend>
            <input
              id="HEX"
              value={cpColor.HEX !== null ? cpColor.HEX : "null"}
              maxLength={6}
              autoComplete="off"
              placeholder="FFFFFF"
              onChange={(e) => cbChange(e, "HEX")}
            />
          </fieldset>
          <fieldset>
            <legend className="draggNone">RGB</legend>
            <input
              id="RGB"
              value={cpColor.RGB !== null ? cpColor.RGB : "null"}
              autoComplete="off"
              placeholder="255, 255, 255"
              onChange={(e) => cbChange(e, "RGB")}
            />
          </fieldset>
          <fieldset>
            <legend className="draggNone">HSL</legend>
            <input
              id="HSL"
              value={cpColor.HSL !== null ? cpColor.HSL : "null"}
              autoComplete="off"
              placeholder="0, 0, 100"
              onChange={(e) => cbChange(e, "HSL")}
            />
          </fieldset>
        </div>
      </div>
    </>
  );
}

export default Tool;
