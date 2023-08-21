export default function App() {
  return (
    <>
      <div className="top">
        <ul className="top-menu">
          <li>
            logo
            <ul className="top-sub-menu">
              <li>About</li>
              <li>Keyboard Shortcut</li>
              <li></li>
            </ul>
          </li>
          <li>
            File
            <ul className="top-sub-menu">
              <li>New Document</li>
              <li>Export as PNG</li>
              <li></li>
            </ul>
          </li>
          <li>
            Edit
            <ul className="top-sub-menu">
              <li>Undo</li>
              <li>Redo</li>
              <li>Cut</li>
              <li>Copy</li>
              <li>Paste</li>
              <li>Duplicate</li>
              <li>Delete</li>
            </ul>
          </li>
          <li>
            Object
            <ul className="top-sub-menu">
              <li>Bring to Front</li>
              <li>Bring Foward</li>
              <li>Send Backward</li>
              <li>Send to Back</li>
              <li>Group Element</li>
              <li>Ungroup Elements</li>
            </ul>
          </li>
          <li>
            view
            <ul className="top-sub-menu">
              <li>View Rulers</li>
              <li>View Wierframes</li>
              <li>Source</li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="left"></div>
      <div className="right"></div>
      <div className="bottom"></div>
    </>
  );
}
