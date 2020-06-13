import { Injectable } from "@angular/core";
import { Mutations, Mutator, Mutation } from "../models";
import { FindAndReplaceComponent } from "../components/mutations/find-and-replace/find-and-replace.component";
import { SwapImageDataComponent } from "../components/mutations/swap-image-data/swap-image-data.component";
import { SettingsService } from "./settings.service";
import { EncodingService } from "./encoding.service";

@Injectable({
  providedIn: "root",
})
export class GlitchService {
  mutatorHash = {
    [Mutations.FindAndReplace.id]: FindAndReplaceComponent,
    [Mutations.SwapImageData.id]: SwapImageDataComponent,
  };

  constructor(
    private settings: SettingsService,
    private encoding: EncodingService
  ) {}

  public getMutatorById(id: string): Mutator {
    const Mutator = this.mutatorHash[id];
    return new Mutator(this.settings);
  }

  public async getUrlFromMutations(mutations: Mutation[]): Promise<string> {
    let imageData = this.encoding.decodeData(this.settings.originalImage);

    mutations.forEach((mutation: Mutation) => {
      const Mutator: Mutator = this.getMutatorById(mutation.id);
      const updatedImage = Mutator.exec(imageData, mutation);
      imageData = updatedImage;
    });
    const encodedUri = this.encoding.encodeData(imageData);
    return encodedUri;
  }
}
