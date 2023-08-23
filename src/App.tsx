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


  return (
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
  );
}
