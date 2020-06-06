import { Injectable } from "@angular/core";
import { MutationId as Id, Mutator } from "../models";
import { FindAndReplaceComponent } from "../components/mutations/find-and-replace/find-and-replace.component";
import { SwapImageDataComponent } from "../components/mutations/swap-image-data/swap-image-data.component";

@Injectable({
  providedIn: "root",
})
export class GlitchService {
  settings = {
    [Id.FindAndReplace]: {
      maxReplaceLength: 6,
    },
    [Id.SwapImageData]: {
      maxSwapLength: 6,
    },
  };
  mutatorHash = {
    [Id.FindAndReplace]: FindAndReplaceComponent,
    [Id.SwapImageData]: SwapImageDataComponent,
  };

  constructor() {}

  public getMutatorById(id: Id): Mutator {
    const Mutator = this.mutatorHash[id];
    return new Mutator(this);
  }
}
