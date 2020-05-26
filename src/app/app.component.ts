import { Component } from "@angular/core";
import { ModifiedImage } from "./models";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  originalImage: string;
  generationSize = 3;
  generatedImages: Array<ModifiedImage> = [];
  maxReplaceLength = 3;
  dataHeader: string;
  mimeType: string;

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
    fileReader.onload = (e) => {
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
      replacementQuery: replaceRegex.source,
      replacementText: replaceStr,
      replacementMatches: decodedUri.match(replaceRegex).length,
      imageData: encodedImageData,
    };
    this.generatedImages.push(modifiedImage);
  }
}
