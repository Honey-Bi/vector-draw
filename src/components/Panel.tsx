import React from "react";
import { History, Select, Size, SvgObject, SvgType } from "../types";

type Props = {
  select: Select;
  canvasSize: Size;
  setCanvasSize: (e: React.SetStateAction<Size>) => void;
  svgList: SvgObject<SvgType>[];
  setSvgList: (e: React.SetStateAction<SvgObject<SvgType>[]>) => void;
  history: History[];
  setHistory: (e: History[]) => void;
  setTmpHistory: (e: History[]) => void;
};
function Panel({
  select,
  canvasSize,
  setCanvasSize,
  svgList,
  setSvgList,
  history,
  setHistory,
  setTmpHistory,
}: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "height") {
      setCanvasSize((prev) => ({ ...prev, height: Number(e.target.value) }));
    } else if (e.target.id === "width") {
      setCanvasSize((prev) => ({ ...prev, width: Number(e.target.value) }));
    }
  }

  // 오브젝트 이름변경 함수
  function ObjectTitleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    svgList[index].title = e.target.value;
  }

  // Name input 렌더링 함수
  function renderName(index: number): JSX.Element {
    return (
      <div className="input-group" key={index}>
        <label htmlFor="title">title</label>
        <input
          className="panel-input"
          type="text"
          id="title"
          placeholder="NoTitle"
          value={svgList[index].title}
          onChange={(e) => ObjectTitleChange(e, index)}
        />
      </div>
    );
  }

  function handleObjectChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: SvgType,
    property: string
  ) {
    const value = Number(e.target.value);
    const updateList = [...svgList];
    switch (type) {
      case "line": {
        let item = updateList[index] as SvgObject<typeof type>;
        let split = property.split(".");
        item.property[split[0] as "position1" | "position2"][split[1] as "x" | "y"] =
          value;
        break;
      }
      case "rect": {
        let item = updateList[index] as SvgObject<typeof type>;
        switch (property) {
          case "width":
          case "height":
            item.property.size[property] = value;
            break;
          case "x":
          case "y":
            item.property.position[property] = value;
            break;
        }
        break;
      }
      case "ellipse": {
        let item = updateList[index] as SvgObject<typeof type>;
        switch (property) {
          case "rx":
          case "ry":
            item.property.radius[property] = value;
            break;
          case "x":
          case "y":
            item.property.position[property] = value;
            break;
        }
        break;
      }
    }
    setSvgList(updateList);
  }

  function alignShapes(
    index: number,
    type: SvgType,
    align: "vertical" | "horizontal",
    alignment: "start" | "center" | "end"
  ) {
    const updateList = [...svgList];
    const [xy, size]: ["x" | "y", "width" | "height"] =
      align === "horizontal" ? ["x", "width"] : ["y", "height"];

    switch (type) {
      case "line": {
        let item = updateList[index] as SvgObject<typeof type>;
        const min = Math.min(item.property.position1[xy], item.property.position2[xy]);
        const max = Math.max(item.property.position1[xy], item.property.position2[xy]);

        if (alignment === "start") {
          item.property.position1[xy] -= min;
          item.property.position2[xy] -= min;
        } else if (alignment === "center") {
          const middle = (max - min) / 2 + min;
          item.property.position1[xy] += canvasSize.height / 2 - middle;
          item.property.position2[xy] += canvasSize.height / 2 - middle;
        } else {
          item.property.position1[xy] -= max - canvasSize[size];
          item.property.position2[xy] -= max - canvasSize[size];
        }
        break;
      }
      case "rect": {
        let item = updateList[index] as SvgObject<typeof type>;
        if (alignment === "start") {
          item.property.position[xy] = 0;
        }
        if (alignment === "center") {
          item.property.position[xy] =
            canvasSize[size] / 2 - item.property.size[size] / 2;
        } else {
          item.property.position[xy] = canvasSize[size] - item.property.size[size];
        }
        break;
      }
      case "ellipse": {
        let item = updateList[index] as SvgObject<typeof type>;
        const rxy = align === "horizontal" ? "rx" : "ry";
        if (alignment === "start") {
          item.property.position[xy] = item.property.radius[rxy];
        } else if (alignment === "center") {
          item.property.position[xy] = canvasSize[size] / 2;
        } else {
          item.property.position[xy] = canvasSize[size] - item.property.radius[rxy];
        }
        break;
      }
    }

    setSvgList(updateList);
    setTmpHistory([]);
  }

  function renderProperty(index: number, type: SvgType): JSX.Element {
    let result = [];
    switch (type) {
      case "line": {
        let item = svgList[index] as SvgObject<typeof type>;
        result.push(
          <div key={type}>
            <div className="row">
              <fieldset className="input-group">
                <legend>x1</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position1.x}
                  onChange={(e) => handleObjectChange(e, index, type, "position1.x")}
                />
              </fieldset>
              <fieldset className="input-group">
                <legend>y1</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position1.y}
                  onChange={(e) => handleObjectChange(e, index, type, "position1.y")}
                />
              </fieldset>
            </div>
            <div className="row">
              <fieldset className="input-group">
                <legend>x2</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position2.x}
                  onChange={(e) => handleObjectChange(e, index, type, "position2.x")}
                />
              </fieldset>
              <fieldset className="input-group">
                <legend>y2</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position2.y}
                  onChange={(e) => handleObjectChange(e, index, type, "position2.y")}
                />
              </fieldset>
            </div>
          </div>
        );
        break;
      }
      case "rect": {
        let item = svgList[index] as SvgObject<typeof type>;
        result.push(
          <div key={type}>
            {/* Size */}
            <div className="row">
              <fieldset className="input-group">
                <legend>width</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.size.width}
                  onChange={(e) => handleObjectChange(e, index, type, "width")}
                />
              </fieldset>
              <fieldset className="input-group">
                <legend>height</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.size.height}
                  onChange={(e) => handleObjectChange(e, index, type, "height")}
                />
              </fieldset>
            </div>
            {/* Position */}
            <div className="row">
              <fieldset className="input-group">
                <legend>x</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position.x}
                  onChange={(e) => handleObjectChange(e, index, type, "x")}
                />
              </fieldset>
              <fieldset className="input-group">
                <legend>y</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position.y}
                  onChange={(e) => handleObjectChange(e, index, type, "y")}
                />
              </fieldset>
            </div>
          </div>
        );
        break;
      }
      case "ellipse": {
        let item = svgList[index] as SvgObject<typeof type>;
        result.push(
          <div key={type}>
            <div className="row">
              <fieldset className="input-group">
                <legend>rx</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.radius.rx}
                  onChange={(e) => handleObjectChange(e, index, type, "rx")}
                />
              </fieldset>
              <fieldset className="input-group">
                <legend>ry</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.radius.ry}
                  onChange={(e) => handleObjectChange(e, index, type, "ry")}
                />
              </fieldset>
            </div>
            <div className="row">
              <fieldset className="input-group">
                <legend>x</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position.x}
                  onChange={(e) => handleObjectChange(e, index, type, "x")}
                />
              </fieldset>
              <fieldset className="input-group">
                <legend>y</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position.y}
                  onChange={(e) => handleObjectChange(e, index, type, "y")}
                />
              </fieldset>
            </div>
          </div>
        );
        break;
      }
    }
    return <>{result}</>;
  }

  function renderPanel() {
    let result = [];
    if (select === null) {
      result.push(
        <div key="panel-null">
          <div className="select">Canvas</div>
          <div className="input-group">
            <label htmlFor="title">title</label>
            <input className="panel-input" type="text" id="title" placeholder="NoTitle" />
          </div>
          <div className="row">
            <fieldset className="input-group">
              <legend>width</legend>
              <input
                type="number"
                id="width"
                min="1"
                onChange={handleChange}
                value={canvasSize.width}
                className="panel-input"
              />
            </fieldset>

            <fieldset className="input-group">
              <legend>height</legend>
              <input
                type="number"
                id="height"
                min="1"
                onChange={handleChange}
                value={canvasSize.height}
                className="panel-input"
              />
            </fieldset>
          </div>
        </div>
      );
    } else if (select.length === 1) {
      const type = select[0].split("-")[0] as SvgType;
      const index = Number(select[0].split("-")[1]);
      // 오브젝트 이름
      const name = renderName(index);
      const property = renderProperty(index, type);
      result.push(
        <div key={select[0]}>
          <div className="select">{type}</div>
          {name}
          {property}
          <div className="align">
            <fieldset className="vertical">
              <legend>vertical</legend>
              <div
                className="top"
                onClick={() => alignShapes(index, type, "vertical", "start")}
              />
              <div
                className="middle"
                onClick={() => alignShapes(index, type, "vertical", "center")}
              />
              <div
                className="bottom"
                onClick={() => alignShapes(index, type, "vertical", "end")}
              />
            </fieldset>
            <fieldset className="horizontal">
              <legend>horizontal</legend>
              <div
                className="left"
                onClick={() => alignShapes(index, type, "horizontal", "start")}
              />
              <div
                className="center"
                onClick={() => alignShapes(index, type, "horizontal", "center")}
              />
              <div
                className="right"
                onClick={() => alignShapes(index, type, "horizontal", "end")}
              />
            </fieldset>
          </div>
        </div>
      );
    } else {
    }
    return result;
  }
  return <div className="panel">{renderPanel()}</div>;
}

export default Panel;
