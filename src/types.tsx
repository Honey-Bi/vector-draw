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
type Radius = { rx: number; ry: number };

type Size = { width: number; height: number };

type Select = string | null;

type RGB = { r: number; g: number; b: number };
type Color = RGB | null;

type Palette = { fill: Color; stroke: Color };

type KeyBind = { ctrl: boolean; shift: boolean; alt: boolean };

type SvgType = "pencil" | "line" | "rect" | "ellipse" | "polygon" | "path" | "text";

type Command = "l" | "c" | "z" | "m" | "h" | "v" | "t";

type Path = {
  c: Command;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
};

type PencilProperty = {
  stroke: Color;
  strokeWidth: number;
  path: Path[];
};
type LineProperty = {
  position1: Position;
  position2: Position;
  strokeWidth: number;
  stroke: RGB;
};
type RectProperty = {
  position: Position;
  size: Size;
  fill: Color;
  stroke: Color;
  strokeWidth: number;
};
type EllipseProperty = {
  position: Position;
  radius: Radius;
  fill: Color;
  stroke: Color;
  strokeWidth: number;
};
type PolygonProperty = {};
type PathProperty = {
  fill: Color;
  stroke: Color;
  strokeWidth: number;
  path: Path[];
};
type TextProperty = {
  fill: Color;
  stroke: Color;
  strokeWidth: number;
  fontSize: number;
  position: Position;
  content: string;
};

type Property<T> = T extends "pencil"
  ? PencilProperty
  : T extends "line"
  ? LineProperty
  : T extends "rect"
  ? RectProperty
  : T extends "ellipse"
  ? EllipseProperty
  : T extends "polygon"
  ? PolygonProperty
  : T extends "path"
  ? PathProperty
  : T extends "text"
  ? TextProperty
  : never;

type SvgObject<T extends SvgType> = {
  id: string;
  title: string;
  type: T;
  property: Property<T>;
};

type LogType = "create" | "update" | "delete";
type History = [LogType, SvgType, number, SvgObject<SvgType>?];

type Modal = {
  Source: boolean;
  Command: boolean;
};

export type {
  Tools,
  Position,
  SvgType,
  Select,
  Palette,
  Color,
  KeyBind,
  SvgObject,
  Size,
  History,
  Modal,
};
