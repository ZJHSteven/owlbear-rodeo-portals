import {
  buildShape,
  Curve,
  Image,
  isCurve,
  isImage,
  isLine,
  isShape,
  Item,
  Line,
  Math2,
  Shape,
} from "@owlbear-rodeo/sdk";
import deg2rad from "../../../math/deg2rad";
import scale from "../../../math/scale";
import rotate from "../../../math/rotate";
import {
  Circle,
  Hexagon,
  isCircle,
  isHexagon,
  isRectangle,
  isTriangle,
  Rectangle,
  Triangle,
} from "./types";

// Can't get bounding box of Text or Path because too complex.
// Work-around using OBR's native functions doesn't work for players because
// they can't get bounding boxes of hidden items.
export type SupportedItem = Curve | Line | Image | Shape;

export function isSupported(item: Item): item is SupportedItem {
  return isCurve(item) || isLine(item) || isImage(item) || isShape(item);
}

export default async function getItemBounds(item: SupportedItem) {
  if (isCurve(item)) {
    return getCurveBoundingBox(item);
  }

  if (isLine(item)) {
    return getLineBoundingBox(item);
  }

  if (isImage(item)) {
    return getImageBoundingBox(item);
  }

  if (isShape(item)) {
    return getShapeBoundingBox(item);
  }

  throw `unsupported item type`;
}

async function getCurveBoundingBox(curve: Curve) {
  const boundingBox = Math2.boundingBox(curve.points);

  const radians = deg2rad(curve.rotation);
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);

  const dx = -boundingBox.center.x * curve.scale.x;
  const dy = -boundingBox.center.y * curve.scale.y;

  const originalPosition = {
    x: boundingBox.center.x + dx * cos - dy * sin,
    y: boundingBox.center.y + dy * cos + dx * sin,
  };

  const offset = {
    x: curve.position.x - originalPosition.x,
    y: curve.position.y - originalPosition.y,
  };

  const points = curve.points.map((point) => {
    const scaled = scale(point, boundingBox.center, curve.scale);
    const rotated = rotate(scaled, boundingBox.center, curve.rotation);
    return {
      x: rotated.x + offset.x,
      y: rotated.y + offset.y,
    };
  });

  return Math2.boundingBox(points);
}

async function getLineBoundingBox(line: Line) {
  const points = [
    {
      x: line.position.x + line.startPosition.x,
      y: line.position.y + line.startPosition.y,
    },
    {
      x: line.position.x + line.endPosition.x,
      y: line.position.y + line.endPosition.y,
    },
  ];

  return Math2.boundingBox(points);
}

async function getImageBoundingBox(image: Image) {
  const scaleDpi = 150 / image.grid.dpi;
  const scaleX = scaleDpi * image.scale.x;
  const scaleY = scaleDpi * image.scale.y;

  const offsetX = image.grid.offset.x * scaleX;
  const offsetY = image.grid.offset.y * scaleY;

  const radians = deg2rad(image.rotation);
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);

  const rectangle = buildShape()
    .shapeType("RECTANGLE")
    .rotation(image.rotation)
    .width(image.image.width)
    .height(image.image.height)
    .scale({
      x: scaleX,
      y: scaleY,
    })
    .position({
      x: image.position.x - offsetX * cos + offsetY * sin,
      y: image.position.y - offsetY * cos - offsetX * sin,
    })
    .build();

  if (isRectangle(rectangle)) {
    return getRectangleBoundingBox(rectangle);
  }

  console.error(rectangle);
  throw `shape doesn't look like a rectangle`;
}

async function getShapeBoundingBox(shape: Shape) {
  if (isCircle(shape)) {
    return getCircleBoundingBox(shape);
  }

  if (isHexagon(shape)) {
    return getHexagonBoundingBox(shape);
  }

  if (isRectangle(shape)) {
    return getRectangleBoundingBox(shape);
  }

  if (isTriangle(shape)) {
    return getTriangleBoundingBox(shape);
  }

  throw `shape.shapeType unsupported: ${shape.shapeType}`;
}

async function getCircleBoundingBox(circle: Circle) {
  const width = circle.width * circle.scale.x;
  const height = circle.height * circle.scale.y;
  const radius = Math.min(width, height) / 2;

  return {
    min: { x: circle.position.x - radius, y: circle.position.y - radius },
    max: { x: circle.position.x + radius, y: circle.position.y + radius },
    center: { x: circle.position.x, y: circle.position.y },
    width,
    height,
  };
}

async function getHexagonBoundingBox(hexagon: Hexagon) {
  const radius = (hexagon.width / 2) * hexagon.scale.x;
  const radians = deg2rad(hexagon.rotation);
  const corners = [
    Math.PI / 2,
    Math.PI / 6,
    (11 * Math.PI) / 6,
    (3 * Math.PI) / 2,
    (7 * Math.PI) / 6,
    (5 * Math.PI) / 6,
  ].map((angle) => {
    angle = angle + radians;
    return {
      x: hexagon.position.x + radius * Math.cos(angle),
      y: hexagon.position.y + radius * Math.sin(angle),
    };
  });

  return Math2.boundingBox(corners);
}

async function getRectangleBoundingBox(rectangle: Rectangle) {
  const radians = deg2rad(rectangle.rotation);
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);

  const rX = (rectangle.width / 2) * rectangle.scale.x;
  const rY = (rectangle.height / 2) * rectangle.scale.y;

  const center = {
    x: rectangle.position.x + rX * cos - rY * sin,
    y: rectangle.position.y + rY * cos + rX * sin,
  };

  const corners = [
    {
      x: center.x - rX * cos + rY * sin,
      y: center.y - rX * sin - rY * cos,
    },
    {
      x: center.x + rX * cos + rY * sin,
      y: center.y + rX * sin - rY * cos,
    },
    {
      x: center.x + rX * cos - rY * sin,
      y: center.y + rX * sin + rY * cos,
    },
    {
      x: center.x - rX * cos - rY * sin,
      y: center.y - rX * sin + rY * cos,
    },
  ];

  return Math2.boundingBox(corners);
}

async function getTriangleBoundingBox(triangle: Triangle) {
  const radians = deg2rad(triangle.rotation);
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);

  const halfWidth = (triangle.width / 2) * triangle.scale.x;
  const height = triangle.height * triangle.scale.y;

  const corners = [
    {
      x: triangle.position.x,
      y: triangle.position.y,
    },
    {
      x: triangle.position.x - halfWidth * cos - height * sin,
      y: triangle.position.y + height * cos - halfWidth * sin,
    },
    {
      x: triangle.position.x + halfWidth * cos - height * sin,
      y: triangle.position.y + height * cos + halfWidth * sin,
    },
  ];

  return Math2.boundingBox(corners);
}
