import { Injectable } from "@angular/core";
import { MutationId, Settings, ModifiedImage } from "../models";
import { EncodingService } from "./encoding.service";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  originalImage: string;
  epoch = 0;
  generationSize = 6;
  generatedImages: Array<ModifiedImage> = [];

  mutations = {
    [MutationId.FindAndReplace]: {
      maxReplaceLength: 6,
    },
    [MutationId.SwapImageData]: {
      maxSwapLength: 6,
    },
  };

  constructor(private encoding: EncodingService) {
    this.load();
  }

  load() {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const {
        originalImage,
        generationSize,
        generatedImages,
        epoch,
        mimeType,
        dataHeader,
      }: Settings = JSON.parse(settings);
      this.originalImage = originalImage;
      this.generationSize = generationSize;
      this.generatedImages = generatedImages;
      this.encoding.mimeType = mimeType;
      this.encoding.dataHeader = dataHeader;
      this.epoch = epoch;
    }
  }

  save() {
    const settings: Settings = {
      originalImage: this.originalImage,
      generationSize: this.generationSize,
      generatedImages: this.generatedImages,
      dataHeader: this.encoding.dataHeader,
      mimeType: this.encoding.mimeType,
      epoch: this.epoch,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
  }
}
