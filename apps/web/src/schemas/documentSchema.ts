import {
  CanvasObject,
  TDocumentPageOrientation,
} from "@/app/[locale]/(authorized)/document/[documentId]/types/document";
import { PAGE_SIZES } from "@/data/page_sizing";
import { Schema } from "mongoose";
import { TGoogleFont } from "./fontSchema";

export type TPDFDateFormat = `D:${string}${string}${string}${string}${string}${string}Z`;

export interface IDocumentPage {
  _id: string;
  version: string;
  backgroundColor?: string;
  page_size: keyof typeof PAGE_SIZES | "CUSTOM";
  page_orientation: TDocumentPageOrientation;
  height: number;
  width: number;
  thumbnail: string;
  objects: CanvasObject[];
}

export interface IDocument {
  _id: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  name: string;
  metadata: {
    CreationDate: TPDFDateFormat;
    ModDate: TPDFDateFormat;
    PDFFormatVersion: "1.0" | "1.1" | "1.2" | "1.3" | "1.4" | "1.5" | "1.6" | "1.7" | "2.0";
    Author: string;
    Creator: string;
    Producer: string;
    Title: string;
    Subject: string;
    Keywords: string;
    Language: string;
    Trapped: Record<string, string>;
    EncryptFilterName: null | string;
    IsAcroFormPresent: boolean;
    IsCollectionPresent: boolean;
    IsLinearized: boolean;
    IsSignaturesPresent: boolean;
    IsXFAPresent: boolean;
    Custom: Record<string, string>;
  };
  pages: IDocumentPage[];
  fonts: TDocumentFont[];
}

export type TDocumentEmbeddedFont = {
  _id: string;
  type: "EMBEDDED";
  name: string;
  fontData?: string;
  support_italic: boolean;
  weight: ("100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900")[];
  src: string;
};
export interface TDocumentGoogleFont extends TGoogleFont {
  font_id: string;
}

export type TDocumentFont = TDocumentEmbeddedFont | TDocumentGoogleFont;

export const documentPageSchema = new Schema({
  version: {
    type: String,
    required: true,
  },
  backgroundColor: String,
  page_size: {
    type: String,
    enum: Object.keys(PAGE_SIZES).concat("CUSTOM"),
    required: true,
    default: "A4",
  },
  page_orientation: {
    type: String,
    enum: ["PORTRAIT", "LANDSCAPE"],
    required: true,
    default: "PORTRAIT",
  },
  height: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  objects: [Schema.Types.Mixed],
});

export const documentSchema = new Schema(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    metadata: {
      CreationDate: {
        type: String,
        default: () => {
          const now = new Date();
          const year = now.getUTCFullYear().toString().padStart(4, "0");
          const month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
          const day = now.getUTCDate().toString().padStart(2, "0");
          const hour = now.getUTCHours().toString().padStart(2, "0");
          const minute = now.getUTCMinutes().toString().padStart(2, "0");
          const second = now.getUTCSeconds().toString().padStart(2, "0");
          return `D:${year}${month}${day}${hour}${minute}${second}Z`;
        },
      },
      ModDate: {
        type: String,
        default: () => {
          const now = new Date();
          const year = now.getUTCFullYear().toString().padStart(4, "0");
          const month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
          const day = now.getUTCDate().toString().padStart(2, "0");
          const hour = now.getUTCHours().toString().padStart(2, "0");
          const minute = now.getUTCMinutes().toString().padStart(2, "0");
          const second = now.getUTCSeconds().toString().padStart(2, "0");
          return `D:${year}${month}${day}${hour}${minute}${second}Z`;
        },
      },
      PDFFormatVersion: {
        type: String,
        enum: ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "2.0"],
        default: "1.7",
      },
      Author: String,
      Creator: String,
      Producer: String,
      Title: String,
      Subject: String,
      Keywords: String,
      Language: String,
      Trapped: Schema.Types.Mixed,
      EncryptFilterName: String,
      IsAcroFormPresent: Boolean,
      IsCollectionPresent: Boolean,
      IsLinearized: Boolean,
      IsSignaturesPresent: Boolean,
      IsXFAPresent: Boolean,
      Custom: {
        type: Map,
        of: String,
      },
    },
    fonts: [
      {
        type: {
          type: String,
          enum: ["EMBEDDED", "GOOGLE"],
          required: true,
        },
        name: String,
        fontData: String,
        support_italic: Boolean,
        weight: {
          type: [String],
          enum: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
        },
        src: String,
        font_id: {
          type: Schema.Types.ObjectId,
          ref: "Font",
        },
      },
    ],
    pages: {
      type: [documentPageSchema],
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
