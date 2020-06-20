import { Injectable } from "@angular/core";
import { ModifiedImage, OriginalImage } from "../models";
import { Mutations } from "../constants";

interface Settings {
  originalImages: Array<OriginalImage>;
  epoch: number;
  generationSize: number;
  generatedImages: Array<ModifiedImage>;
}

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  originalImages: Array<OriginalImage>;
  epoch = 0;
  generationSize = 6;
  generatedImages: Array<ModifiedImage> = [];

  mutations = {
    [Mutations.FindAndReplace.id]: {
      maxReplaceLength: 6,
    },
    [Mutations.SwapImageData.id]: {
      maxSwapLength: 6,
    },
  };

  constructor() {
    this.load();
  }

  load() {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const {
        originalImages = [],
        generationSize,
        generatedImages,
        epoch,
      }: Settings = JSON.parse(settings);
      this.originalImages = originalImages;
      this.generationSize = generationSize;
      this.generatedImages = generatedImages;
      this.epoch = epoch;
    } else {
      this.save();
    }
  }

  save() {
    const settings: Settings = {
      originalImages: this.originalImages,
      generationSize: this.generationSize,
      generatedImages: this.generatedImages,
      epoch: this.epoch,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
  }
}
