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
type Size = { width: number; height: number };

type Select = SVGSVGElement | null;

type Color = { r: number; g: number; b: number } | null;

type Palette = { fill: Color; stroke: Color };

type KeyBind = { ctrl: boolean; shift: boolean; alt: boolean };

type SvgType =
  | "pencil"
  | "line"
  | "rect"
  | "ellipse"
  | "polygon"
  | "path"
  | "text";

type Command = "d" | "";
type Shape = { command: Command; x?: number; y?: number };

type SvgObject = {
  id: string;
  title: string;
  type: SvgType;
  position?: Position;
  position1?: Position;
  position2?: Position;
  fill?: Color;
  size?: Size;
  stroke?: Color;
  strokeWidth?: number;
  points?: Position[];
  d?: Shape[];
};

export type { Tools, Position, Select, Palette, KeyBind, SvgObject, Size };
