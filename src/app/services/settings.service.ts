import { Injectable } from "@angular/core";
import { MutationId } from "../models";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  mutations = {
    [MutationId.FindAndReplace]: {
      maxReplaceLength: 6,
    },
    [MutationId.SwapImageData]: {
      maxSwapLength: 6,
    },
  };

  constructor() {}
}
