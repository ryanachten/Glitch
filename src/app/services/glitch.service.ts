import { Injectable } from "@angular/core";
import { SwapImageData } from "../utilities/mutations/SwapImageData";
import { FindAndReplace } from "../utilities/mutations/FindAndReplace";
import { MutationId, Mutator } from "../models";

@Injectable({
  providedIn: "root",
})
export class GlitchService {
  mutatorHash = {
    [MutationId.FindAndReplace]: FindAndReplace,
    [MutationId.SwapImageData]: SwapImageData,
  };

  constructor() {}

  public getMutatorById(id: MutationId): Mutator {
    const Mutator = this.mutatorHash[id];
    return new Mutator();
  }
}
