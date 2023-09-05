import { BaseSyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "../types";

type Props = {
  setModal: (value: React.SetStateAction<Modal>) => void;
  commands: {
    undo: () => void;
    redo: () => void;
  };
  history: {
    history: number;
    tmpHistory: number;
  };
};
export default function Menu({ setModal, commands, history }: Props) {
  const menuRef = useRef<HTMLUListElement>(null); // 메뉴창 ref
  const [active, setActive] = useState<number>(-1); // 몇번째가 열려있는지

  function open(e: BaseSyntheticEvent, index: number) {
    // 메뉴창 여는 함수
    if (active === index) {
      close();
      setActive(-1);
      return;
    }
    close();
    const target = e.target as Element;
    const list = document.getElementsByClassName("menu-list")[index];
    target.classList.add("active");
    list.classList.add("active");
    setActive(index);
  }

  const close = useCallback(() => {
    // 메뉴창 닫기 함수
    if (menuRef.current && active !== -1) {
      const menu = menuRef.current.children[active];
      menu.classList.remove("active");
    }
  }, [active]);

  useEffect(() => {
    // 외부영역 클릭 이벤트 감지후 메뉴창 닫음
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [close, menuRef]);

  function Shift() {
    return <></>;
  }

  return (
    <ul className="menu" ref={menuRef}>
      <li onClick={(e) => open(e, 0)}>
        logo
        <ul className="menu-list">
          <a
            href="https://github.com/Honey-Bi/vector-draw"
            target="_blank"
            rel="noreferrer"
          >
            <li>About</li>
          </a>
          <li onClick={() => setModal((prev) => ({ ...prev, Command: true }))}>
            Keyboard Shortcut <div className="shortcut">Ctrl + /</div>
          </li>
        </ul>
      </li>
      <li onClick={(e) => open(e, 1)}>
        File
        <ul className="menu-list">
          <li>New Document</li>
          <li>Export as PNG</li>
        </ul>
      </li>
      <li onClick={(e) => open(e, 2)}>
        Edit
        <ul className="menu-list">
          <li
            onClick={history.history ? commands.undo : undefined}
            className={`${history.history ? "" : "disabled"}`}
          >
            Undo <div className="shortcut">Ctrl + Z</div>
          </li>
          <li
            onClick={history.tmpHistory ? commands.redo : undefined}
            className={`${history.tmpHistory ? "" : "disabled"}`}
          >
            Redo
            <div className="shortcut">
              Ctrl + <Shift /> + Z
            </div>
          </li>
          <li>
            Cut<div className="shortcut">Ctrl + X</div>
          </li>
          <li>
            Copy<div className="shortcut">Ctrl + C</div>
          </li>
          <li>
            Paste<div className="shortcut">Ctrl + V</div>
          </li>
          <li>
            Duplicate<div className="shortcut">Ctrl + D</div>
          </li>
          <li>
            Delete<div className="shortcut">Delete</div>
          </li>
        </ul>
      </li>
      <li onClick={(e) => open(e, 3)}>
        Object
        <ul className="menu-list">
          <li>Bring to Front</li>
          <li>Bring Foward</li>
          <li>Send Backward</li>
          <li>Send to Back</li>
          <li>
            Group Element<div className="shortcut">Ctrl + G</div>
          </li>
          <li>
            Ungroup Elements
            <div className="shortcut">
              Ctrl + <Shift /> + G
            </div>
          </li>
        </ul>
      </li>
      <li onClick={(e) => open(e, 4)}>
        View
        <ul className="menu-list">
          <li>
            <input type="checkbox" id="ruler" />
            <label htmlFor="ruler">
              View Rulers<div className="shortcut">Ctrl + R</div>
            </label>
          </li>
          <li>View Wierframes</li>
          <li onClick={() => setModal((prev) => ({ ...prev, Source: true }))}>Source</li>
        </ul>
      </li>
    </ul>
  );
}
