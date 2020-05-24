import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  originalImage: string;
  modifiedImage: string;
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
    const fileReader: FileReader = new FileReader();
    fileReader.onload = e => {
      const encodedUri = e.target.result.toString();
      this.setDataHeader(encodedUri);
      this.originalImage = encodedUri;
      this.mutateImage();
    };
    fileReader.readAsDataURL(files[0]);
  }

  seedQuery(imageBody: string) {
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
    let replaceRegex;
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
      replaceRegex
    };
  }

  updateImage(modifiedImage) {
    const encodedModifiedImage = `${this.dataHeader}${btoa(modifiedImage)}`;
    this.modifiedImage = encodedModifiedImage;
    this.generateCanvas();
  }

  mutateImage() {
    const decodedUri = atob(this.originalImage.replace(this.dataHeader, ""));
    const { replaceRegex, replaceStr } = this.seedQuery(decodedUri);
    this.replaceQueryMatches = decodedUri.match(replaceRegex).length;

    const modifiedImage = decodedUri.replace(replaceRegex, replaceStr);
    this.updateImage(modifiedImage);
  }

  generateCanvas() {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      canvas.height = image.height;
      canvas.width = image.width;
      ctx.drawImage(image, 0, 0);
    };
    image.src = this.modifiedImage;
  }
}
