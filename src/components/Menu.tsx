import {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function Menu() {
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

  return (
    <ul className="menu" ref={menuRef}>
      <li onClick={(e) => open(e, 0)}>
        logo
        <ul className="menu-list">
          <li>About</li>
          <li>Keyboard Shortcut</li>
          <li></li>
        </ul>
      </li>
      <li onClick={(e) => open(e, 1)}>
        File
        <ul className="menu-list">
          <li>New Document</li>
          <li>Export as PNG</li>
          <li></li>
        </ul>
      </li>
      <li onClick={(e) => open(e, 2)}>
        Edit
        <ul className="menu-list">
          <li>Undo</li>
          <li>Redo</li>
          <li>Cut</li>
          <li>Copy</li>
          <li>Paste</li>
          <li>Duplicate</li>
          <li>Delete</li>
        </ul>
      </li>
      <li onClick={(e) => open(e, 3)}>
        Object
        <ul className="menu-list">
          <li>Bring to Front</li>
          <li>Bring Foward</li>
          <li>Send Backward</li>
          <li>Send to Back</li>
          <li>Group Element</li>
          <li>Ungroup Elements</li>
        </ul>
      </li>
      <li onClick={(e) => open(e, 4)}>
        View
        <ul className="menu-list">
          <li>View Rulers</li>
          <li>View Wierframes</li>
          <li>Source</li>
        </ul>
      </li>
    </ul>
  );
}
