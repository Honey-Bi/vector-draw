import React, { useEffect, useState } from "react";
import Menu from "./components/Menu";
import Panel from "./components/Panel";
import Tool from "./components/Tool";
import Canvas from "./components/Canvas";

import shortcut from "./shorcut.json";

import {
  Tools,
  Select,
  Palette,
  KeyBind,
  Size,
  SvgObject,
  SvgType,
  History,
} from "./types";
import "./index.css";

export default function App() {
  const [tool, setTool] = useState<Tools>("select");
  const [palette, setPalette] = useState<Palette>({
    stroke: { r: 0, g: 0, b: 0 },
    fill: null,
  });
  const [bindKey, setBindKey] = useState<KeyBind>({
    ctrl: false,
    shift: false,
    alt: false,
  });
  const [select, setSelect] = useState<Select>(null);
  const [canvasSize, setCanvasSize] = useState<Size>({
    width: 400,
    height: 400,
  });

  // undo, redo용 유저행동정보 저장용 상태
  const [history, setHistory] = useState<History[]>([]);
  const [tmpHistory, setTmpHistory] = useState<History[]>([]);

  const [svgList, setSvgList] = useState<SvgObject<SvgType>[]>([]);

  useEffect(() => {
    console.log("----history 변경----");
    for (let i of history) {
      console.log(i);
    }
    console.log("-------------------");
  }, [history]);

  useEffect(() => {
    console.log("----svgList 변경----");
    for (let i of svgList) {
      console.log(i);
    }
    console.log("-------------------");
  }, [svgList]);

  // 단축키 함수
  function shortcuts(e: React.KeyboardEvent) {
    const key = e.key.toLocaleLowerCase();

    setBindKey({ ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });

    if (e.ctrlKey && e.shiftKey) {
      // ctrl + shift + ?
      switch (key) {
        case "z": // redo
          const tmp = tmpHistory.pop();
          if (tmp === undefined) break;
          if (tmp[0] === "create") {
            let id = tmp[3]!.type + "-" + svgList.length;
            tmp[3]!.id = id;
            setHistory([...history, [tmp[0], tmp[1], svgList.length, tmp[3]!]]);
            setSvgList([...svgList, tmp[3]!]);
            setSelect(id);
          }
          break;
      }
    } else if (e.ctrlKey) {
      // ctrl + ?
      switch (key) {
        case "z": // undo
          const tmp = history.pop();
          if (tmp === undefined) break;

          setTmpHistory([...tmpHistory, tmp]);
          setHistory([...history]);

          if (tmp[0] === "create") {
            if (tmp[1] !== "path") {
              svgList.splice(tmp[2], 1);
            }

            if (history.length - 1 === -1) setSelect(null);
            else setSelect(`${tmp[1]}-${history.length - 1}`);
          }
          break;
      }
    } else if (e.shiftKey) {
      //shift + ?
      switch (key) {
      }
    }
  }

  //Tool 단축키
  function shortcutTool(e: React.KeyboardEvent) {
    if (e.ctrlKey || e.shiftKey || e.altKey) return;
    const key = e.key.toLocaleLowerCase();
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

  // 특수키 뗏을때 상태 변경
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
          shortcutTool={shortcutTool}
        />
        <Canvas
          tool={tool}
          setSelect={setSelect}
          keyBind={bindKey}
          palette={palette}
          shortcutTool={shortcutTool}
          canvasSize={canvasSize}
          svgList={svgList}
          setSvgList={setSvgList}
          setHistory={setHistory}
          setTmpHistory={setTmpHistory}
        />
        <Panel
          select={select}
          canvasSize={canvasSize}
          setCanvasSize={setCanvasSize}
          svgList={svgList}
          setSvgList={setSvgList}
          history={history}
          setHistory={setHistory}
          setTmpHistory={setTmpHistory}
        />
      </div>
    </div>
  );
}
