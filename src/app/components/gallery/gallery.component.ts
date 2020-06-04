import { Component, OnInit } from "@angular/core";
import { ModifiedImage, Settings, ReplacementMutation } from "src/app/models";
import { EncodingService } from "src/app/services/encoding.service";
import { GlitchService } from "src/app/services/glitch.service";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent implements OnInit {
  originalImage: string;
  epoch = 0;
  generationSize = 6;
  generatedImages: Array<ModifiedImage> = [];
  maxReplaceLength = 3;

  constructor(
    public encodingService: EncodingService,
    private glitchService: GlitchService
  ) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const {
        originalImage,
        generationSize,
        generatedImages,
        maxReplaceLength,
        epoch,
        mimeType,
        dataHeader,
      }: Settings = JSON.parse(settings);
      this.originalImage = originalImage;
      this.generationSize = generationSize;
      this.generatedImages = generatedImages;
      this.encodingService.mimeType = mimeType;
      this.maxReplaceLength = maxReplaceLength;
      this.encodingService.dataHeader = dataHeader;
      this.epoch = epoch;
    }
  }

  saveSettings() {
    const settings: Settings = {
      originalImage: this.originalImage,
      generationSize: this.generationSize,
      generatedImages: this.generatedImages,
      maxReplaceLength: this.maxReplaceLength,
      dataHeader: this.encodingService.dataHeader,
      mimeType: this.encodingService.mimeType,
      epoch: this.epoch,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
  }

  uploadImage(event) {
    const files = event.target.files;
    if (!files.length) {
      return;
    }
    const fileReader: FileReader = new FileReader();
    fileReader.onload = () => {
      if (!fileReader.result) {
        return null;
      }
      const encodedUri = fileReader.result.toString();
      this.encodingService.setDataHeader(encodedUri);
      this.originalImage = encodedUri;
      this.createGeneration();
    };
    fileReader.readAsDataURL(files[0]);
  }

  resetEvolution() {
    this.generatedImages = [];
    this.epoch = 0;
    this.saveSettings();
  }

  async createGeneration() {
    for (let i = 0; i < this.generationSize; i++) {
      const existingImage = this.generatedImages[i];
      const image = await this.mutateImage(
        // If image does not exist at index, create new one
        existingImage || {
          mutations: [],
          imageData: this.originalImage,
        }
      );
      // If image already exists, replace it with updated img
      existingImage
        ? (this.generatedImages[i] = image)
        : this.generatedImages.push(image);
    }
    this.epoch = this.epoch + 1;
    this.saveSettings();
  }

  async redoGeneration() {
    for (let i = 0; i < this.generationSize; i++) {
      const existingImage = this.generatedImages[i];
      let image = await this.undoMutation(existingImage);
      image = await this.mutateImage(image);
      this.generatedImages[i] = image;
    }
    this.saveSettings();
  }

  async previousGeneration() {
    for (let i = 0; i < this.generationSize; i++) {
      const existingImage = this.generatedImages[i];
      const image = await this.undoMutation(existingImage);
      this.generatedImages[i] = image;
    }
    this.epoch = this.epoch - 1;
    this.saveSettings();
  }

  async undoMutation({ mutations }: ModifiedImage) {
    const decodedUri = this.encodingService.decodeData(this.originalImage);
    const previousMutations = mutations.slice(0, -1);

    let currentImageData = decodedUri;
    await previousMutations.map(
      async ({ replacementText, replacementQuery }: ReplacementMutation) => {
        const { updatedImageData } = this.glitchService.findAndReplace(
          decodedUri,
          new RegExp(replacementQuery, "g"),
          replacementText
        );
        currentImageData = updatedImageData;
      }
    );

    const encodedImageData = this.encodingService.encodeData(currentImageData);
    const modifiedImage: ModifiedImage = {
      mutations: previousMutations,
      imageData: encodedImageData,
    };
    return modifiedImage;
  }

  async mutateImage({
    imageData,
    mutations,
  }: ModifiedImage): Promise<ModifiedImage> {
    const decodedUri = this.encodingService.decodeData(imageData);
    const { replaceRegex, replaceString } = this.glitchService.seedReplaceQuery(
      decodedUri,
      this.maxReplaceLength
    );
    // const {
    //   updatedImageData,
    //   replacementMatches,
    // } = this.glitchService.findAndReplace(
    //   decodedUri,
    //   replaceRegex,
    //   replaceString
    // );

    const swapMatrix = this.glitchService.seedSwapImageMatrix(decodedUri, 100);
    const updatedImageData = this.glitchService.swapImageMatrix(
      decodedUri,
      swapMatrix
    );

    const encodedImageData = this.encodingService.encodeData(updatedImageData);

    const modifiedImage: ModifiedImage = {
      mutations: [
        ...mutations,
        swapMatrix,
        // {
        // replacementQuery: replaceRegex.source,
        // replacementText: replaceString,
        // replacementMatches: replacementMatches,
        // },
      ],
      imageData: encodedImageData,
    };
    return modifiedImage;
  }
}
