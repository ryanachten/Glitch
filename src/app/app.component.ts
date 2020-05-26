import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  originalImage: string;
  generationSize = 3;
  generatedImages: Array<string> = [];
  replaceQueryString: string;
  replaceQueryMatches: number;
  replaceSubstituteString: string;
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
    for (let index = 0; index < this.generationSize; index++) {
      await this.mutateImage();
    }
    this.updateCanvas();
  }

  seedQuery(
    imageBody: string
  ): {
    replaceStr: string;
    replaceRegex: RegExp;
  } {
    const substrLength = Math.floor(Math.random() * this.maxReplaceLength) || 1;

    let queryStr: string;
    const setQueryStr = () => {
      const startIndex =
        Math.floor(Math.random() * (imageBody.length - substrLength)) || 1;
      queryStr = imageBody.substr(startIndex, substrLength);
    };
    setQueryStr();

    const replaceIndex =
      Math.floor(Math.random() * (imageBody.length - substrLength)) || 1;
    const replaceStr = imageBody.substr(replaceIndex, substrLength);

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

    this.replaceQueryString = queryStr;
    this.replaceSubstituteString = replaceStr;

    return {
      replaceStr,
      replaceRegex,
    };
  }

  async mutateImage() {
    const decodedUri = atob(this.originalImage.replace(this.dataHeader, ""));
    const { replaceRegex, replaceStr } = this.seedQuery(decodedUri);
    this.replaceQueryMatches = decodedUri.match(replaceRegex).length;

    const modifiedImage = decodedUri.replace(replaceRegex, replaceStr);
    const encodedModifiedImage = `${this.dataHeader}${btoa(modifiedImage)}`;
    this.generatedImages.push(encodedModifiedImage);
  }

  loadImages() {
    return new Promise((resolve) => {
      const loadedImages = [];
      this.generatedImages.forEach((imgData) => {
        const img = new Image();
        img.src = imgData;
        img.onload = () => {
          loadedImages.push(img);
          if (loadedImages.length === this.generationSize) {
            resolve(loadedImages);
          }
        };
      });
    });
  }

  async updateCanvas() {
    const loadedImages = await this.loadImages();
    // TODO: find proper angular way of doing this
    const canvases = document.querySelectorAll("canvas");
    canvases.forEach((canvas: HTMLCanvasElement, index: number) => {
      const ctx = canvas.getContext("2d");
      const image = loadedImages[index];
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    });

    // const canvas = document.querySelector("canvas");
    // const ctx = canvas.getContext("2d");
    // const image = new Image();
    // image.onload = () => {
    //   let canvasWidth = image.width;
    //   let canvasHeight = image.height;

    //   // Scale image down if it exceeds window dimensions
    //   if (canvasWidth > window.innerWidth) {
    //     canvasHeight = (window.innerWidth / canvasWidth) * canvasHeight;
    //     canvasWidth = window.innerWidth;
    //   }
    //   if (canvasHeight > window.innerHeight) {
    //     canvasWidth = (window.innerWidth / canvasHeight) * canvasWidth;
    //     canvasHeight = window.innerHeight;
    //   }

    //   canvas.width = canvasWidth;
    //   canvas.height = canvasHeight;
    //   ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    // };
    // image.src = this.generatedImages[0];
  }
}
