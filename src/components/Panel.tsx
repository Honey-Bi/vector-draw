import React from "react";
import { Select, Size, SvgObject, SvgType, Tools } from "../types";

type Props = {
  tool: Tools;
  select: Select;
  canvasSize: Size;
  setCanvasSize: (e: Size) => void;
  svgList: React.MutableRefObject<SvgObject<SvgType>[]>;
};
function Panel({ tool, select, canvasSize, setCanvasSize, svgList }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "height") {
      setCanvasSize({
        width: canvasSize.width,
        height: Number(e.target.value),
      });
    }
    if (e.target.id === "width") {
      setCanvasSize({
        width: Number(e.target.value),
        height: canvasSize.height,
      });
    }
  }

  function ObjectChange(e: React.ChangeEvent<HTMLInputElement>, type: Tools) {}

  function renderPanel() {
    let result = [];
    if (select) {
      const type = select.id.split("-")[0] as Tools;
      const index = Number(select.id.split("-")[1]) as number;
      switch (type) {
        case "line":
          result.push(
            <div key={select.id}>
              <div className="select">Line</div>
              <div className="input-group">
                <label htmlFor="title">title</label>
                <input
                  className="panel-input"
                  type="text"
                  id="title"
                  placeholder="NoTitle"
                  value={svgList.current[index].title}
                />
              </div>
            </div>
          );
          break;
        case "rect":
          result.push(
            <div key={select.id}>
              <div className="select">Line</div>
              <div className="input-group">
                <label htmlFor="title">title</label>
                <input
                  className="panel-input"
                  type="text"
                  id="title"
                  placeholder="NoTitle"
                  value={svgList.current[index].title}
                  onChange={(e) => ObjectChange(e, type)}
                />
              </div>
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
            <input className="panel-input" type="text" id="title" placeholder="NoTitle" />
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
