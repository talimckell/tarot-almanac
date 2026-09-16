// Loads the brand fonts from local TTFs vendored in remotion/public/fonts (downloaded
// once from Google Fonts), so renders never depend on the network. loadFont handles
// Remotion's delayRender/continueRender internally — importing this module for its
// side effect is enough.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Cormorant", url: staticFile("fonts/Cormorant-SemiBold.ttf"), weight: "600" });
loadFont({ family: "Cormorant", url: staticFile("fonts/Cormorant-SemiBoldItalic.ttf"), weight: "600", style: "italic" });
loadFont({ family: "Lato", url: staticFile("fonts/Lato-Regular.ttf"), weight: "400" });
loadFont({ family: "Lato", url: staticFile("fonts/Lato-Bold.ttf"), weight: "700" });
