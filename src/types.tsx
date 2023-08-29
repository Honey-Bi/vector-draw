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

type RGB = { r: number; g: number; b: number };
type Color = RGB | null;

type Palette = { fill: Color; stroke: Color };

type KeyBind = { ctrl: boolean; shift: boolean; alt: boolean };

type SvgType = "pencil" | "line" | "rect" | "ellipse" | "polygon" | "path" | "text";

type Command = "d" | "";
type Shape = { command: Command; x?: number; y?: number };

type Property<T> = T extends "pencil"
  ? {}
  : T extends "line"
  ? {
      position1: Position;
      position2: Position;
      strokeWidth: number;
      stroke: RGB;
    }
  : T extends "rect"
  ? {
      position: Position;
      size: Size;
      fill: Color;
      stroke: Color;
      strokeWidth: number;
    }
  : T extends "ellipse"
  ? {}
  : T extends "polygon"
  ? {}
  : T extends "path"
  ? { d: Shape[] }
  : /* text*/ {
      fill: Color;
      stroke: Color;
      strokeWidth: number;
      fontSize: number;
      position: Position;
      content: string;
    };

type SvgObject<T extends SvgType> = {
  id: string;
  title: string;
  type: T;
  property: Property<T>;
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
};
