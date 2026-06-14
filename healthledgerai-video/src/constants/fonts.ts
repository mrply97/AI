import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";

// Module-scope font loading — these run once when imported.
const { fontFamily: cormorant } = loadCormorant("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: jost } = loadJost("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const FONTS = {
  serif: cormorant,  // Cormorant Garamond — headings
  sans: jost,        // Jost — body / labels
};
