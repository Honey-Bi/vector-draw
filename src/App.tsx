import LowComponent from "./components/LowComponent";
import Menu from "./components/menu";
import Panel from "./components/panel";
import Tool from "./components/tool";

import "./index.css";

export default function App() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });

  const handleDataChange = (newData: String) => {
    console.log(newData);
  };

  return (
    <GlobalProvider>
      <Menu />
      <Tool />
      <Panel />
    </GlobalProvider>
  );
}
