import React, { useState } from "react";

type tools =
  | "select"
  | "pencil"
  | "line"
  | "rect"
  | "circle"
  | "shape"
  | "path"
  | "text"
  | "zoom"
  | "spoid";

export interface GlobalState {
  tool: tools;
  setTool: (value: string) => void;
}

export const GlobalContext = React.createContext<GlobalState>({
  tool: "select",
  setTool: () => {},
});

const GlobalProvider: React.FC = ({}) => {
  const [tool, setTool] = useState<tools>("select");

  const state: GlobalState = { tool, setTool };

  return <GlobalContext.Provider value={state}>{}</GlobalContext.Provider>;
};

export default GlobalProvider;
