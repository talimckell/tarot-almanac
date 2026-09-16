// Remotion root: registers the DailyCard composition. Duration is computed per-video
// from the essence text via the same shortTiming() the composition itself uses.
// sample-props.json is a checked-in real day (regenerate with
// `npm run short:props -- <date> --sample`) so `npm run short:studio` previews without
// any assembly step; real renders pass --props with that day's JSON.
import { Composition } from "remotion";
import { DailyCard } from "./DailyCard";
import { BearingProof, PROOF_FPS, proofDuration } from "./BearingProof";
import { timingForProps } from "./timing";
import type { ShortProps } from "./types";
import type { BearingProofProps } from "./proofTypes";
import sample from "./sample-props.json";
import proofSample from "./bearing-proof-props.json";
import proofSynced from "./bearing-proof-synced.json";
import "./fonts";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="DailyCard"
        component={DailyCard}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={510}
        // Double cast: TS infers the imported JSON's attr objects as unions of exact
        // shapes (with optional keys), which don't satisfy Record<string, string>.
        defaultProps={sample as unknown as ShortProps}
        calculateMetadata={({ props }) => ({ durationInFrames: timingForProps(props).total })}
      />
      <Composition
        id="BearingProof"
        component={BearingProof}
        width={1920}
        height={1080}
        fps={PROOF_FPS}
        durationInFrames={proofDuration(5)}
        defaultProps={proofSample as unknown as BearingProofProps}
        calculateMetadata={({ props }) => ({ durationInFrames: proofDuration(props.rows.length) })}
      />
      <Composition
        id="BearingProofSynced"
        component={BearingProof}
        width={1920}
        height={1080}
        fps={PROOF_FPS}
        durationInFrames={Math.round(86 * PROOF_FPS)}
        defaultProps={proofSynced as unknown as BearingProofProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.sync ? Math.round(props.sync.total * PROOF_FPS) : proofDuration(props.rows.length),
        })}
      />
    </>
  );
}
