import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  originalImage: string;
  modifiedImage: string;
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

  generateRandomQuery(imageBody: string) {
    const substrLength = Math.floor(Math.random() * 3);
    const startIndex = Math.floor(
      Math.random() * (imageBody.length - substrLength)
    );
    const replaceIndex = Math.floor(
      Math.random() * (imageBody.length - substrLength)
    );
    const queryStr = imageBody.substr(startIndex, substrLength);
    const replaceStr = imageBody.substr(replaceIndex, substrLength);
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
    const { replaceRegex, replaceStr } = this.generateRandomQuery(decodedUri);
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
