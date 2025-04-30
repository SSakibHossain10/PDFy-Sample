"use client";

import { DEFAULT_FONT_WEIGHT } from "@/constants/document";
import { TDocumentFont } from "@/schemas/documentSchema";
import { TGoogleFont } from "@/schemas/fontSchema";
import LoadingIcn from "@icons/loading.svg";
import { MouseEvent, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TActiveTextFont, THandleChangeActiveTextFont } from "./FontCardsWrapper";

const SubFontFamilyCard = ({
  font,
  weight,
  activeTextFont,
  handleChangeActiveTextFont,
}: {
  font: TDocumentFont | TGoogleFont;
  weight: TDocumentFont["weight"][0];
  activeTextFont: TActiveTextFont;
  handleChangeActiveTextFont: THandleChangeActiveTextFont;
}) => {
  const [fontLoading, setFontLoading] = useState(false);
  return (
    <>
      {font.type === "GOOGLE" ? (
        <button
          className="flex items-center py-1 pl-7 rounded-md hover:bg-primary-200/10 active:bg-primary-200/10"
          onClick={() => {
            setFontLoading(true);
            handleChangeActiveTextFont({
              fontFamily: font.name,
              fontWeight: weight,
              font,
              fontUpdattedInDbCallback: () => setFontLoading(false),
            });
          }}
        >
          <img
            loading="lazy"
            src={font.preview_weight_urls[weight]}
            className="h-6 w-auto"
            alt={`${font.name} font preview`}
          />

          <div>
            <FaCheck
              className={`h-5.5 w-7.5 px-2 hover:text-primary-500 active:text-primary-500${
                activeTextFont.fontFamily === font.name && activeTextFont.fontWeight === weight && !fontLoading
                  ? " "
                  : " hidden"
              }`}
            />
            <LoadingIcn
              className={`h-5.5 w-7.5 px-2 animate-spin hover:text-primary-500 active:text-primary-500${
                activeTextFont.fontFamily === font.name && activeTextFont.fontWeight === weight && fontLoading
                  ? " "
                  : " hidden"
              }`}
            />
          </div>
        </button>
      ) : (
        <button
          className="flex items-center py-1 pl-7 rounded-md hover:bg-primary-200/10 active:bg-primary-200/10"
          onClick={() => {
            setFontLoading(true);
            handleChangeActiveTextFont({
              fontFamily: font.name,
              fontWeight: weight,
              font,
              fontUpdattedInDbCallback: () => setFontLoading(false),
            });
          }}
        >
          <h6
            className="grow hover:text-primary-500 active:text-primary-500"
            style={{ fontFamily: font.name, fontWeight: weight }}
          >
            {weight === "100"
              ? "Thin"
              : weight === "200"
                ? "ExtraLight"
                : weight === "300"
                  ? "Light"
                  : weight === "400"
                    ? "Regular"
                    : weight === "500"
                      ? "Medium"
                      : weight === "600"
                        ? "SemiBold"
                        : weight === "700"
                          ? "Bold"
                          : weight === "800"
                            ? "ExtraBold"
                            : weight === "900"
                              ? "Heavy"
                              : "Regular"}
          </h6>
          <div>
            <FaCheck
              className={`h-5.5 w-7.5 px-2 hover:text-primary-500 active:text-primary-500${
                activeTextFont.fontFamily === font.name && activeTextFont.fontWeight === weight && !fontLoading
                  ? " "
                  : " hidden"
              }`}
            />
            <LoadingIcn
              className={`h-5.5 w-7.5 px-2 animate-spin hover:text-primary-500 active:text-primary-500${
                activeTextFont.fontFamily === font.name && activeTextFont.fontWeight === weight && fontLoading
                  ? " "
                  : " hidden"
              }`}
            />
          </div>
        </button>
      )}
    </>
  );
};

const FontFamilyCard = ({
  font,
  activeTextFont,
  handleChangeActiveTextFont,
}: {
  font: TDocumentFont | TGoogleFont;
  activeTextFont: TActiveTextFont;
  handleChangeActiveTextFont: THandleChangeActiveTextFont;
}) => {
  const [fontLoading, setFontLoading] = useState(false);
  return (
    <>
      {font.type === "GOOGLE" ? (
        <details className="flex flex-col h-fit open:*:first:*:first:rotate-90 open:*:first:*:first:-mb-1 open:*:first:*:last:hidden">
          <summary className="flex items-center rounded-md hover:bg-primary-200/10 active:bg-primary-200/10 cursor-pointer">
            <MdOutlineKeyboardArrowRight className="w-7 h-8 pr-1 hover:text-primary-500 active:text-primary-500 transition-all transition-discrete" />
            <div
              className="grow h-9 flex items-center"
              onClick={(e) => {
                e.preventDefault();
                setFontLoading(true);
                handleChangeActiveTextFont({
                  fontFamily: font.name,
                  fontWeight: DEFAULT_FONT_WEIGHT,
                  font,
                  fontUpdattedInDbCallback: () => setFontLoading(false),
                });
              }}
            >
              <img loading="lazy" src={font.preview_img} className="h-6 w-auto" alt={`${font.name} font preview`} />
            </div>
            <div>
              <FaCheck
                className={`h-5.5 w-7.5 px-2 hover:text-primary-500 active:text-primary-500${
                  activeTextFont.fontFamily === font.name && !fontLoading ? " " : " hidden"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setFontLoading(true);
                  handleChangeActiveTextFont({
                    fontFamily: font.name,
                    fontWeight: DEFAULT_FONT_WEIGHT,
                    font,
                    fontUpdattedInDbCallback: () => setFontLoading(false),
                  });
                }}
              />
              <LoadingIcn
                className={`h-5.5 w-7.5 px-2 animate-spin hover:text-primary-500 active:text-primary-500${
                  activeTextFont.fontFamily === font.name && fontLoading ? " " : " hidden"
                }`}
                onClick={(e: MouseEvent<SVGElement, MouseEvent>) => {
                  e.preventDefault();
                }}
              />
            </div>
          </summary>

          <div className="flex flex-col">
            {font.weight.map((weight) => (
              <SubFontFamilyCard
                key={weight}
                font={font}
                weight={weight}
                activeTextFont={activeTextFont}
                handleChangeActiveTextFont={handleChangeActiveTextFont}
              />
            ))}
          </div>
        </details>
      ) : (
        <details className="flex flex-col h-fit open:*:first:*:first:rotate-90 open:*:first:*:first:-mb-1 open:*:first:*:last:hidden">
          <summary className="flex items-center rounded-md hover:bg-primary-200/10 active:bg-primary-200/10 cursor-pointer">
            <MdOutlineKeyboardArrowRight className="w-7 h-8 pr-1 hover:text-primary-500 active:text-primary-500 transition-all transition-discrete" />
            <h6
              className="grow h-9 flex items-center hover:text-primary-500 active:text-primary-500"
              style={{ fontFamily: font.name }}
              onClick={(e) => {
                e.preventDefault();
                setFontLoading(true);
                handleChangeActiveTextFont({
                  fontFamily: font.name,
                  fontWeight: DEFAULT_FONT_WEIGHT,
                  font,
                  fontUpdattedInDbCallback: () => setFontLoading(false),
                });
              }}
            >
              {font.name}
            </h6>
            <div>
              <FaCheck
                className={`h-5.5 w-7.5 px-2 hover:text-primary-500 active:text-primary-500${
                  activeTextFont.fontFamily === font.name && !fontLoading ? " " : " hidden"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setFontLoading(true);
                  handleChangeActiveTextFont({
                    fontFamily: font.name,
                    fontWeight: DEFAULT_FONT_WEIGHT,
                    font,
                    fontUpdattedInDbCallback: () => setFontLoading(false),
                  });
                }}
              />
              <LoadingIcn
                className={`h-5.5 w-7.5 px-2 animate-spin hover:text-primary-500 active:text-primary-500${
                  activeTextFont.fontFamily === font.name && fontLoading ? " " : " hidden"
                }`}
                onClick={(e: MouseEvent<SVGElement, MouseEvent>) => {
                  e.preventDefault();
                }}
              />
            </div>
          </summary>

          <div className="flex flex-col">
            {font.weight.map((weight) => (
              <SubFontFamilyCard
                key={weight}
                font={font}
                weight={weight}
                activeTextFont={activeTextFont}
                handleChangeActiveTextFont={handleChangeActiveTextFont}
              />
            ))}
          </div>
        </details>
      )}
    </>
  );
};

export default FontFamilyCard;
