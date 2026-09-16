// Remotion CLI config for the daily-Short render pipeline (see /remotion). The public
// dir is remotion-only so the vendored font TTFs never ship with the Next.js site.
import { Config } from "@remotion/cli/config";

Config.setEntryPoint("remotion/index.ts");
Config.setPublicDir("remotion/public");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
