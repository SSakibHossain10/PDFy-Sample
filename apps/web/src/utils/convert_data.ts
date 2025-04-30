import { TPDFDateFormat } from "@/schemas/documentSchema";

export function uint8ArrayToBase64(uint8Array: Uint8Array<ArrayBufferLike>) {
  let binary = "";
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary); // Convert binary string to Base64
}

export function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64); // Decode Base64 string to binary
  const len = binaryString.length;
  const uint8Array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array;
}

export function uint8ArrayToColorString(colorArray: Uint8ClampedArray): string {
  if (!colorArray || colorArray.length < 3) return "#000000"; // Default to black

  // Parse RGB values (and alpha if present)
  const [r, g, b, a] = colorArray;

  // Handle alpha (if provided)
  if (a !== undefined && a !== 255) {
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  }

  return `rgb(${r}, ${g}, ${b})`;
}

export const valueStringPxToNumber = (value: string): number => {
  return parseFloat(value.replace("px", ""));
};

export const convertFixedToPercent = (value: number, total: number): number => {
  return (value / total) * 100;
};

export const pdfDateToJsDate = (pdfDate: TPDFDateFormat): Date => {
  try {
    const year = parseInt(pdfDate.substring(2, 6), 10);
    const month = parseInt(pdfDate.substring(6, 8), 10) - 1; // JavaScript months are 0-indexed
    const day = parseInt(pdfDate.substring(8, 10), 10);
    const hour = parseInt(pdfDate.substring(10, 12), 10);
    const minute = parseInt(pdfDate.substring(12, 14), 10);
    const second = parseInt(pdfDate.substring(14, 16), 10);

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  } catch (error) {
    console.error("Error parsing PDF date:", error);
    return new Date(); // Return current date if parsing fails
  }
};
