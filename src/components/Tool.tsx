import { useState } from "react";
import { Palette, Tools } from "../types";

type Props = {
  tool: Tools;
  setTool: (tools: Tools) => void;
  palette: Palette;
  setPalette: (color: Palette) => void;
};

function Tool({ tool, setTool, palette, setPalette }: Props) {
  const xmlns = "http://www.w3.org/2000/svg";

  useEffect(() => {
    select.propFunction(tool);
  }, [tool, select]);

  return (
    <div className="tool">
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
        title="Pencil Tool"
        onClick={(e) => setTool("pencil")}
      >
        <svg xmlns={xmlns} viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
        </svg>
      </div>
      <div
        className={`tool-button ${tool === "line" ? "active" : ""}`}
        title="Line Tool"
        onClick={(e) => setTool("line")}
      >
        <svg viewBox="0 0 27 27" xmlns={xmlns}>
          <path d="M 3 1 L 26 24 L 24 26 L 1 3 L 3 1 Z"></path>
        </svg>
      </div>
      <div
        className={`tool-button ${tool === "rect" ? "active" : ""}`}
        title="Square/Rect Tool"
        onClick={(e) => setTool("rect")}
      >
        <svg viewBox="0 0 27 27" xmlns={xmlns}>
          <path d="M 0 8 L 0 24 L 24 24 L 25 8 L 0 8 Z"></path>
        </svg>
      </div>
      <div
        className={`tool-button ${tool === "circle" ? "active" : ""}`}
        title="Ellipse/Circle Tool"
        onClick={(e) => setTool("circle")}
      >
        <svg viewBox="0 0 27 27" xmlns={xmlns}>
          <ellipse cx="13" cy="13" rx="13" ry="9"></ellipse>
        </svg>
      </div>
      <div
        className={`tool-button ${tool === "shape" ? "active" : ""}`}
        title="Shape Tool"
        onClick={(e) => setTool("shape")}
      >
        <svg xmlns={xmlns} height="27" width="27" viewBox="0 0 24 24">
          <polygon points="14.43,10 12,2 9.57,10 2,10 8.18,14.41 5.83,22 12,17.31 18.18,22 15.83,14.41 22,10"></polygon>
        </svg>
      </div>
      <div
        className={`tool-button ${tool === "path" ? "active" : ""}`}
        title="Path Tool"
        onClick={(e) => setTool("path")}
      >
        <svg xmlns={xmlns} viewBox="0 0 27 27">
          <path d="M12.2 1.9c0-.36.86 0 .86 0V14a1.3 1.3 0 10.88 0V1.9s.87-.36.87 0c0 6.81 5.22 11.68 5.22 11.68l-3.25 8.2h-6.55l-3.26-8.2s5.22-4.87 5.22-11.68zM7.83 25.26v-2.61h11.32v2.6H7.84z"></path>
        </svg>
      </div>
      <div
        className={`tool-button ${tool === "text" ? "active" : ""}`}
        title="Text Tool"
        onClick={(e) => setTool("text")}
      >
        <svg xmlns={xmlns} viewBox="2 2 20 20">
          <path d="M5 4v3h5.5v12h3V7H19V4z"></path>
        </svg>
      </div>
      <div
        className={`tool-button ${tool === "zoom" ? "active" : ""}`}
        title="Zoom Tool"
        onClick={(e) => setTool("zoom")}
      >
        <svg xmlns={xmlns} viewBox="2 2 20 20">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
        </svg>
      </div>
      <div
        className={`tool-button mirror ${tool === "spoid" ? "active" : ""}`}
        title="Spoid Tool"
        onClick={(e) => setTool("spoid")}
      >
        <svg xmlns={xmlns} viewBox="2 2 20 20">
          <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"></path>
        </svg>
      </div>
      <div className="color-tool"></div>
    </div>
  );
};

export default Tool;
