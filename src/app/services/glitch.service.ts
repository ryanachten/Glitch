import { Injectable } from "@angular/core";
import { MutationId as Id, Mutator } from "../models";
import { FindAndReplaceComponent } from "../components/mutations/find-and-replace/find-and-replace.component";
import { SwapImageDataComponent } from "../components/mutations/swap-image-data/swap-image-data.component";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class GlitchService {
  mutatorHash = {
    [Id.FindAndReplace]: FindAndReplaceComponent,
    [Id.SwapImageData]: SwapImageDataComponent,
  };

  constructor(private settings: SettingsService) {}

  public getMutatorById(id: Id): Mutator {
    const Mutator = this.mutatorHash[id];
    return new Mutator(this.settings);
  }
}
