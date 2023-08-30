import React from "react";
import { Select, Size, SvgObject, SvgType } from "../types";

type Props = {
  select: Select;
  canvasSize: Size;
  setCanvasSize: (e: Size) => void;
  svgList: React.MutableRefObject<SvgObject<SvgType>[]>;
};
function Panel({ select, canvasSize, setCanvasSize, svgList }: Props) {
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

  // 오브젝트 이름변경 함수
  function ObjectTitleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    svgList.current[index].title = e.target.value;
  }

  // Name input 렌더링 함수
  function renderName(index: number): JSX.Element {
    return (
      <div className="input-group">
        <label htmlFor="title">title</label>
        <input
          className="panel-input"
          type="text"
          id="title"
          placeholder="NoTitle"
          value={svgList.current[index].title}
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
    switch (type) {
      case "line": {
        let item = svgList.current[index] as SvgObject<typeof type>;
        switch (property) {
          case "positionX1":
            item.property.position1.x = value;
            break;
          case "positionX2":
            item.property.position2.x = value;
            break;
          case "positionY1":
            item.property.position1.y = value;
            break;
          case "positionY2":
            item.property.position2.y = value;
            break;
        }
        break;
      }
      case "rect": {
        let item = svgList.current[index] as SvgObject<typeof type>;
        switch (property) {
          case "width":
          case "height":
            item.property.size[property] = value;
            break;
        }
        break;
      }
      case "ellipse": {
        // let item = svgList.current[index] as SvgObject<typeof type>;
        break;
      }
    }
  }

  function renderProperty(index: number, type: SvgType): JSX.Element {
    let result = [];
    switch (type) {
      case "line": {
        let item = svgList.current[index] as SvgObject<typeof type>;
        result.push(
          <div key={index}>
            <div className="row">
              <fieldset className="input-group">
                <legend>x1</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position1.x}
                  onChange={(e) => handleObjectChange(e, index, type, "positionX1")}
                />
              </fieldset>
              <fieldset className="input-group">
                <legend>y1</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position1.y}
                  onChange={(e) => handleObjectChange(e, index, type, "positionY1")}
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
                  onChange={(e) => handleObjectChange(e, index, type, "positionX2")}
                />
              </fieldset>
              <fieldset className="input-group">
                <legend>y2</legend>
                <input
                  type="number"
                  className="panel-input"
                  value={item.property.position2.y}
                  onChange={(e) => handleObjectChange(e, index, type, "positionY2")}
                />
              </fieldset>
            </div>
          </div>
        );
        break;
      }
      case "rect": {
        let item = svgList.current[index] as SvgObject<typeof type>;
        result.push(
          <>
            <div className="row" key={index}>
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
          </>
        );
        break;
      }
      case "ellipse": {
        break;
      }
    }
    return <>{result}</>;
  }

  function renderPanel() {
    let result = [];
    if (select) {
      const type = select.split("-")[0] as SvgType;
      const index = Number(select.split("-")[1]);
      // 오브젝트 이름
      const name = renderName(index);
      const property = renderProperty(index, type);
      result.push(
        <div key={select}>
          <div className="select">{type}</div>
          {name}
          {property}
        </div>
      );
    } else {
      result.push(
        <div key={select}>
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
              <legend>width</legend>
              <input
                type="number"
                id="width"
                min="1"
                onChange={handleChange}
                value={canvasSize.height}
                className="panel-input"
              />
            </fieldset>
          </div>
        </div>
      );
    }
    return result;
  }
  return <div className="panel">{renderPanel()}</div>;
}

export default Panel;
