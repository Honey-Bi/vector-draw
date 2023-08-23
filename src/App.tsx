import React, { useState } from "react";
import Menu from "./components/Menu";
import Panel from "./components/Panel";
import Tool from "./components/Tool";
import Canvas from "./components/Canvas";

import { Tools, Select, Palette, KeyBind } from "./types";
import "./index.css";

export default function App() {
  const [tool, setTool] = useState<Tools>("select");
  const [palette, setPalette] = useState<Palette>({
    fill: { r: 255, g: 255, b: 255 },
    stroke: null,
  });
  const [bindKey, setBindKey] = useState<KeyBind>({
    ctrl: false,
    shift: false,
    alt: false,
  });
  const [select, setSelect] = useState<Select>(null);

  // 단축키 함수
  function shortcuts(e: React.KeyboardEvent) {
    const key = e.key.toLocaleLowerCase();

    setBindKey({
      ctrl: e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
    });

    if (e.ctrlKey && e.shiftKey) {
      // ctrl + shift + ?
      switch (key) {
        case "z":
          console.log("redo");
          break;
      }
    } else if (e.ctrlKey) {
      // ctrl + ?
      switch (key) {
        case "z":
          console.log("undo");
          break;
      }
    } else if (e.shiftKey) {
      //shift + ?
      switch (key) {
      }
    } else {
      // 그냥 단축키
      switch (key) {
        case "v":
          setTool("select");
          break;
        case "b":
          setTool("pencil");
          break;
        case "l":
          setTool("line");
          break;
        case "r":
          setTool("rect");
          break;
        case "c":
          setTool("circle");
          break;
        case "u":
          setTool("shape");
          break;
        case "p":
          setTool("path");
          break;
        case "t":
          setTool("text");
          break;
        case "z":
          setTool("zoom");
          break;
        case "i":
          setTool("spoid");
          break;
      }
    }
  }

  function keyUp(e: React.KeyboardEvent) {
    if (e.key === "Control") setBindKey((prev) => ({ ...prev, ctrl: false }));
    if (e.key === "Shift") setBindKey((prev) => ({ ...prev, shift: false }));
    if (e.key === "Alt") setBindKey((prev) => ({ ...prev, alt: false }));
  }
  return (
    <div tabIndex={0} onKeyDown={shortcuts} onKeyUp={keyUp}>
      <Menu />
      <div className="width-fill">
        <Tool
          tool={tool}
          setTool={setTool}
          palette={palette}
          setPalette={setPalette}
        />
        <Canvas tool={tool} setSelect={setSelect} keyBind={bindKey} />
        <Panel tool={tool} select={select} />
      </div>
    </div>
  );
}
