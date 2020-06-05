import { Injectable } from "@angular/core";
import { MutationId, Mutator } from "../models";
import { FindAndReplaceComponent } from "../components/mutations/find-and-replace/find-and-replace.component";
import { SwapImageDataComponent } from "../components/mutations/swap-image-data/swap-image-data.component";

@Injectable({
  providedIn: "root",
})
export class GlitchService {
  mutatorHash = {
    [MutationId.FindAndReplace]: FindAndReplaceComponent,
    [MutationId.SwapImageData]: SwapImageDataComponent,
  };

  constructor() {}

  public getMutatorById(id: MutationId): Mutator {
    const Mutator = this.mutatorHash[id];
    return new Mutator();
  }
}
