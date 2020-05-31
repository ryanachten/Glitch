import { Component, OnInit } from "@angular/core";
import { ModifiedImage } from "src/app/models";

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
      } = JSON.parse(settings);
      this.originalImage = originalImage;
      this.generationSize = generationSize;
      this.generatedImages = generatedImages;
      this.mimeType = mimeType;
      this.maxReplaceLength = maxReplaceLength;
      this.dataHeader = dataHeader;
    }
  }

  saveSettings() {
    const settings = {
      originalImage: this.originalImage,
      generationSize: this.generationSize,
      generatedImages: this.generatedImages,
      maxReplaceLength: this.maxReplaceLength,
      dataHeader: this.dataHeader,
      mimeType: this.mimeType,
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

  async createGeneration() {
    this.generatedImages = [];
    for (let index = 0; index < this.generationSize; index++) {
      await this.mutateImage();
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

  async mutateImage() {
    const decodedUri = atob(this.originalImage.replace(this.dataHeader, ""));
    const { replaceRegex, replaceStr } = this.seedQuery(decodedUri);

    const imageData = decodedUri.replace(replaceRegex, replaceStr);
    const encodedImageData = `${this.dataHeader}${btoa(imageData)}`;

    const modifiedImage: ModifiedImage = {
      mutations: [
        {
          replacementQuery: replaceRegex.source,
          replacementText: replaceStr,
          replacementMatches: decodedUri.match(replaceRegex).length,
        },
      ],
      imageData: encodedImageData,
    };
    this.generatedImages.push(modifiedImage);
  }
}
