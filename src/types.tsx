type Tools =
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

type Position = { x: number; y: number };

type Select = SVGElement | null;

type Color = { r: number; g: number; b: number } | null;

type Palette = { fill: Color; stroke: Color };

type KeyBind = { ctrl: boolean; shift: boolean; alt: boolean };

export type { Tools, Position, Select, Palette, KeyBind };
