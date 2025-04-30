/* eslint-disable @typescript-eslint/no-unused-vars */
import Document from "@/models/Document";
import Element from "@/models/Element";
import ElementCategory from "@/models/ElementCategory";
import Font from "@/models/Font";
import Language from "@/models/Language";
import Media from "@/models/Media";
import Template from "@/models/Template";
import TemplateCategory from "@/models/TemplateCategory";
import User from "@/models/User";
import mongoose from "mongoose";

// register all modal schemas
const elementCategory = ElementCategory;
const element = Element;
const document = Document;
const language = Language;
const user = User;
const media = Media;
const font = Font;
const template = Template;
const templateCategory = TemplateCategory;

export default async function connectDB() {
  if (!process.env.NEXT_MONGO_DB_URI) {
    console.error("env NEXT_MONGO_DB_URI not provided");
    throw "env NEXT_MONGO_DB_URI not provided";
  }
  mongoose.connect(process.env.NEXT_MONGO_DB_URI).catch((err) => console.error("mongose fallied to connect", err));
}
