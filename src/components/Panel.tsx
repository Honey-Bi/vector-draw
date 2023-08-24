import React from "react";
import { Select, Size, SvgObject, Tools } from "../types";

type Props = {
  tool: Tools;
  select: Select;
  canvasSize: Size;
  setCanvasSize: (e: Size) => void;
};
function Panel({ tool, select, canvasSize, setCanvasSize }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "height") {
      setCanvasSize({
        width: canvasSize.width,
        height: Number(e.target.value),
      });
    } else if (e.target.id === "width") {
      setCanvasSize({
        width: Number(e.target.value),
        height: canvasSize.height,
      });
    }
  }
  function renderPanel() {
    let result = [];
    if (select) {
      switch (select.tagName) {
        case "rect":
          <div key={select.id}></div>;
          break;
        case "line":
          result.push(
            <div key={select.id}>
              <div className="select">Line</div>
            </div>
          );
          break;
      }
    } else {
      result.push(
        <div key={select}>
          <div className="select">Canvas</div>
          <div className="input-group">
            <label htmlFor="title">title</label>
            <input
              className="panel-input"
              type="text"
              id="title"
              placeholder="NoTitle"
            />
          </div>
          <div className="row">
            <div className="input-group">
              <label htmlFor="width">width</label>
              <input
                type="number"
                id="width"
                min="1"
                onChange={handleChange}
                value={canvasSize.width}
                className="panel-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="height">height</label>
              <input
                type="number"
                id="height"
                min="1"
                className="panel-input"
                onChange={handleChange}
                value={canvasSize.height}
              />
            </div>
          </div>
        </div>
      );
    }
    return result;
  }
  return <div className="panel">{renderPanel()}</div>;
}

export default Panel;
