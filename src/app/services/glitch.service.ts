import { Injectable } from "@angular/core";
import { Mutator, Mutation, OriginalImage } from "../models";
import { FindAndReplaceComponent } from "../components/mutations/find-and-replace/find-and-replace.component";
import { SwapImageDataComponent } from "../components/mutations/swap-image-data/swap-image-data.component";
import { SettingsService } from "./settings.service";
import { EncodingService } from "./encoding.service";
import { Mutations } from "../constants";

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

  public async getUrlFromMutations(
    originalImage: OriginalImage,
    mutations: Mutation[]
  ): Promise<string> {
    let imageData = this.encoding.decodeData(
      originalImage.dataHeader,
      originalImage.imageData
    );

    mutations.forEach((mutation: Mutation) => {
      const Mutator: Mutator = this.getMutatorById(mutation.id);
      const updatedImage = Mutator.exec(imageData, mutation);
      imageData = updatedImage;
    });
    const encodedUri = this.encoding.encodeData(
      originalImage.dataHeader,
      imageData
    );
    return encodedUri;
  }
}
