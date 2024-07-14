import { Shape } from "@owlbear-rodeo/sdk";

export interface Rectangle extends Shape {
  shapeType: "RECTANGLE";
}

export function isRectangle(shape: Shape): shape is Rectangle {
  return shape.shapeType === "RECTANGLE";
}

export interface Circle extends Shape {
  shapeType: "CIRCLE";
}

export function isCircle(shape: Shape): shape is Circle {
  return shape.shapeType === "CIRCLE";
}

export interface Triangle extends Shape {
  shapeType: "TRIANGLE";
}

export function isTriangle(shape: Shape): shape is Triangle {
  return shape.shapeType === "TRIANGLE";
}

export interface Hexagon extends Shape {
  shapeType: "HEXAGON";
}

export function isHexagon(shape: Shape): shape is Hexagon {
  return shape.shapeType === "HEXAGON";
}
