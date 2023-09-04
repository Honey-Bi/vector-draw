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
  Modal,
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

  const [Modal, setModal] = useState<Modal>({
    Source: false,
    Command: false,
  });

  useEffect(() => {
    console.log("---- history change ----");
    for (let i of history) {
      console.log(i);
    }
    console.log("------------------------");
  }, [history]);

  useEffect(() => {
    console.log("---- svgList change ----");
    for (let i of svgList) {
      console.log(i);
    }
    console.log("------------------------");
  }, [svgList]);

  // const [tmpSelect, setTmpSelect] = useState<Select>(select);

  // useEffect(() => {
  //   setTmpSelect(select);
  //   if (select) {
  //     const element = document.getElementById(select) as HTMLElement;
  //     element.
  //   }
  // }, [select]);

  // useEffect(() => {
  //   if (tmpSelect) {

  //   }
  // }, [tmpSelect]);

  // 단축키 함수
  function shortcuts(e: React.KeyboardEvent) {
    const key = e.key.toLocaleLowerCase();

    setBindKey({ ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });

    if (e.ctrlKey && e.shiftKey) {
      // ctrl + shift + ?
      switch (key) {
        case "z": // redo
          Commands.redo();
          break;
      }
    } else if (e.ctrlKey) {
      // ctrl + ?
      switch (key) {
        case "z": // undo
          Commands.undo();
          break;
        case "/":
          setModal((prev) => ({ ...prev, Command: !prev.Command }));
          break;
      }
    } else if (e.shiftKey) {
      //shift + ?
      switch (key) {
      }
    } else {
      // 그냥 키입력
      switch (key) {
        case "escape":
          // Modal창이 열려있으면
          if (modalTrue()) setModal({ Source: false, Command: false });
          break;
      }
    }
  }

  const Commands = {
    undo: () => {
      const tmp = history.pop();
      if (tmp === undefined) return;

      if (tmp[0] === "create") {
        if (tmp[1] !== "path") {
          svgList.splice(tmp[2], 1);
        }

        const hl = history.length - 1;
        if (hl === -1) setSelect(null);
        else setSelect([`${history[hl][1]}-${hl}`]);
      }
      setTmpHistory([...tmpHistory, tmp]);
      setHistory([...history]);
    },
    redo: () => {
      const tmp = tmpHistory.pop();
      if (tmp === undefined) return;
      if (tmp[0] === "create") {
        let id = tmp[3]!.type + "-" + svgList.length;
        tmp[3]!.id = id;
        setHistory([...history, [tmp[0], tmp[1], svgList.length, tmp[3]!]]);
        setSvgList([...svgList, tmp[3]!]);
        setSelect([id]);
      }
    },
  };

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

  // Modal 창이 열려있으면 True
  function modalTrue(): boolean {
    for (let i of Object.values(Modal)) if (i) return true;
    return false;
  }

  function renderShortcut(): JSX.Element {
    return (
      <>
        {Object.entries(shortcut).map(([key, value]) => (
          <div className="dialog-scope" key={key}>
            <div className="sub-title">{key}</div>
            {value.map((item) => (
              <div className="shortcut" key={item.explain}>
                <div className="explain">{item.explain}</div>
                {item.key.map((key) => (
                  <div className="btn-shortcut" key={key}>
                    {key}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </>
    );
  }

  return (
    <div tabIndex={0} onKeyDown={shortcuts} onKeyUp={keyUp}>
      <Menu
        setModal={setModal}
        commands={Commands}
        history={{ history: history.length, tmpHistory: tmpHistory.length }}
      />
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
          select={select}
          setSelect={setSelect}
          keyBind={bindKey}
          palette={palette}
          shortcutTool={shortcutTool}
          canvasSize={canvasSize}
          svgList={svgList}
          setSvgList={setSvgList}
          history={history}
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
      <div className={`modal ${modalTrue() ? "open" : ""}`}>
        <div className={`command-dialog ${Modal.Command ? "open" : ""}`}>
          <div className="dialog">
            <div className="title">KeyBoard Shortcut</div>
            <span
              className="command-exit"
              onClick={() => setModal((prev) => ({ ...prev, Command: false }))}
            ></span>
            <div className="multi">{renderShortcut()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
