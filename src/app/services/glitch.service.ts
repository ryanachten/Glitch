import { Injectable } from "@angular/core";
import { SwapImageData } from "../utilities/glitches/SwapImageData";
import { FindAndReplace } from "../utilities/glitches/FindAndReplace";

@Injectable({
  providedIn: "root",
})
export class GlitchService {
  constructor() {}

  seedReplaceQuery = FindAndReplace.seed;

  findAndReplace = FindAndReplace.exec;

  seedSwapImageMatrix = SwapImageData.seed;

  swapImageMatrix = SwapImageData.exec;
}
