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
  dataHeader = "data:image/jpeg;base64,";

  uploadImage(event) {
    const files = event.target.files;
    const fileReader: FileReader = new FileReader();
    fileReader.onload = e => {
      const encodedUri = e.target.result.toString();
      this.originalImage = encodedUri;
      this.mutateImage();
    };
    fileReader.readAsDataURL(files[0]);
  }

  seedQuery(imageBody: string) {
    const substrLength = Math.floor(Math.random() * this.maxReplaceLength) || 1;
    const startIndex =
      Math.floor(Math.random() * (imageBody.length - substrLength)) || 1;
    const replaceIndex =
      Math.floor(Math.random() * (imageBody.length - substrLength)) || 1;
    const queryStr = imageBody.substr(startIndex, substrLength);
    const replaceStr = imageBody.substr(replaceIndex, substrLength);
    this.replaceQueryString = queryStr;
    this.replaceSubstituteString = replaceStr;
    return {
      replaceStr,
      replaceRegex: new RegExp(queryStr, "g")
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
