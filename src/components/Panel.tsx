import { Select, Tools } from "../types";

type Props = {
  tool: Tools;
  select: Select;
};
function Panel({ tool, select }: Props) {
  function renderPanel() {
    let result = [];
    switch (select) {
      case null:
        result.push(
          <div className="title" key={select}>
            Canvas Info
          </div>
        );
        break;
    }
    result.push(
      <div className="" key={tool}>
        <div className=""></div>
      </div>
    );
    return result;
  }
  return <div className="panel">{renderPanel()}</div>;
}

export default Panel;
