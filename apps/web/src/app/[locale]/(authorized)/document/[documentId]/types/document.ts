import CanvasCircle from "../classes/CanvasCircle";
import CanvasGroup from "../classes/CanvasGroup";
import CanvasImage from "../classes/CanvasImage";
import CanvasLine from "../classes/CanvasLine";
import CanvasMarkerDrawingPath from "../classes/CanvasMarkerDrawingPath";
import CanvasPath from "../classes/CanvasPath";
import CanvasPencilDrawingPath from "../classes/CanvasPencilDrawingPath";
import CanvasRect from "../classes/CanvasRect";
import CanvasSignatureText from "../classes/CanvasSignatureText";
import CanvasTextbox from "../classes/CanvasTextbox";
import CanvasFeildCheckbox from "../classes/form/CanvasFeildCheckbox";
import CanvasFeildInput from "../classes/form/CanvasFeildInput";
import CanvasFeildRadio from "../classes/form/CanvasFeildRadio";
import CanvasFeildSelect from "../classes/form/CanvasFeildSelect";
import CanvasFeildSelectMultiple from "../classes/form/CanvasFeildSelectMultiple";
import CanvasFeildTextarea from "../classes/form/CanvasFeildTextarea";

export type CanvasObject =
  | CanvasRect
  | CanvasPath
  | CanvasImage
  | CanvasTextbox
  | CanvasGroup
  | CanvasCircle
  | CanvasLine
  | CanvasFeildInput
  | CanvasFeildTextarea
  | CanvasFeildSelect
  | CanvasFeildSelectMultiple
  | CanvasFeildCheckbox
  | CanvasFeildRadio
  | CanvasPencilDrawingPath
  | CanvasMarkerDrawingPath
  | CanvasSignatureText;

export type TDocumentPageOrientation = "PORTRAIT" | "LANDSCAPE";
