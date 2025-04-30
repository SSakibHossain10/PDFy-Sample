import Element from "@/models/Element";
import { Schema, Types } from "mongoose";

interface IElementTypes {
  _id: string;
  category_id: Types.ObjectId;
  name: string;
  tags: string[];
  image: string;
  order: number;
}

interface IElementRectItem extends IElementTypes {
  type: "RECT";
  src: {
    width: number;
    height: number;
    x: number;
    y: number;
    rx: number;
    ry: number;
  };
}
interface IElementCircleItem extends IElementTypes {
  type: "CIRCLE";
  src: {
    r: number;
    cx: number;
    cy: number;
  };
}
interface IElementLineItem extends IElementTypes {
  type: "LINE";
  src: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}
interface IElementPathItem extends IElementTypes {
  type: "PATH";
  src: {
    d: string;
  };
}

export type IElement = IElementRectItem | IElementCircleItem | IElementLineItem | IElementPathItem;

export const elementSchema = new Schema({
  categoty_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ElementCategory",
  },
  type: {
    type: String,
    enum: ["PATH", "POLYLINE", "POLyGON", "RECT", "CIRCLE", "ELLIPSE", "IMAGE", "TEXT"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  src: {
    type: Schema.Types.Mixed,
    required: true,
  },
  order: Number,
});

// Pre-save hook to set the 'order' field
elementSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastElementCategory = await Element.findOne().sort({
      order: -1,
    });
    this.order = lastElementCategory ? lastElementCategory.order + 1 : 1;
  }
  next();
});
