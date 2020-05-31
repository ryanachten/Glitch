import { Component, OnInit } from "@angular/core";
import { ModifiedImage, Settings } from "src/app/models";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent implements OnInit, Settings {
  originalImage: string;
  epoch = 0;
  generationSize = 6;
  generatedImages: Array<ModifiedImage> = [];
  maxReplaceLength = 3;
  dataHeader: string;
  mimeType: string;

  constructor() {}

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
        mimeType,
        maxReplaceLength,
        dataHeader,
        epoch,
      }: Settings = JSON.parse(settings);
      this.originalImage = originalImage;
      this.generationSize = generationSize;
      this.generatedImages = generatedImages;
      this.mimeType = mimeType;
      this.maxReplaceLength = maxReplaceLength;
      this.dataHeader = dataHeader;
      this.epoch = epoch;
    }
  }

  saveSettings() {
    const settings: Settings = {
      originalImage: this.originalImage,
      generationSize: this.generationSize,
      generatedImages: this.generatedImages,
      maxReplaceLength: this.maxReplaceLength,
      dataHeader: this.dataHeader,
      mimeType: this.mimeType,
      epoch: this.epoch,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
  }

  setDataHeader(dataUri: string) {
    const mimeRegex = /data:(.*);base64,/;
    const regexMatches = mimeRegex.exec(dataUri);
    if (regexMatches && regexMatches.length) {
      this.dataHeader = regexMatches[0];
      this.mimeType = regexMatches[1];
    }
  }

  uploadImage(event) {
    const files = event.target.files;
    if (!files.length) {
      return;
    }
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target.result) {
        return null;
      }
      const encodedUri = e.target.result.toString();
      this.setDataHeader(encodedUri);
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

  seedQuery(
    imageBody: string
  ): {
    replaceStr: string;
    replaceRegex: RegExp;
  } {
    const substrLength = Math.floor(Math.random() * this.maxReplaceLength) || 1;

    const replaceIndex =
      Math.floor(Math.random() * (imageBody.length - substrLength)) || 1;
    const replaceStr = imageBody.substr(replaceIndex, substrLength);

    let queryStr: string;
    const setQueryStr = () => {
      const startIndex =
        Math.floor(Math.random() * (imageBody.length - substrLength)) || 1;
      queryStr = imageBody.substr(startIndex, substrLength);
    };
    setQueryStr();

    // Random query string sometimes produces invalid regex
    // keep randomly generating until a valid one is produced
    let replaceRegex: RegExp;
    while (!replaceRegex) {
      try {
        const tmpRegex = new RegExp(queryStr, "g");
        replaceRegex = tmpRegex;
      } catch (error) {
        setQueryStr();
      }
    }

    return {
      replaceStr,
      replaceRegex,
    };
  }

  async mutateImage(image: ModifiedImage): Promise<ModifiedImage> {
    const decodedUri = atob(image.imageData.replace(this.dataHeader, ""));
    const { replaceRegex, replaceStr } = this.seedQuery(decodedUri);

    const replacementMatches = decodedUri.match(replaceRegex);
    const updatedImageData = decodedUri.replace(replaceRegex, replaceStr);
    const encodedImageData = `${this.dataHeader}${btoa(updatedImageData)}`;

    const modifiedImage: ModifiedImage = {
      mutations: [
        ...image.mutations,
        {
          replacementQuery: replaceRegex.source,
          replacementText: replaceStr,
          replacementMatches: replacementMatches
            ? replacementMatches.length
            : 0,
        },
      ],
      imageData: encodedImageData,
    };
    return modifiedImage;
  }
}
