import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  originalImage: string;
  modifiedImage: string;

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

  mutateImage() {
    const dataHeader = "data:image/jpeg;base64,";
    const decodedUri = atob(this.originalImage.replace(dataHeader, ""));
    const replaceRegex = this.generateRandomQuery(decodedUri);
    console.log("replaceRegex", replaceRegex);
    const matches = decodedUri.match(replaceRegex);
    if (matches && matches.length) {
      console.log("matches", matches.length);
      const modifiedImage = decodedUri.replace(replaceRegex, "cd");
      const encodedModifiedImage = `${dataHeader}${btoa(modifiedImage)}`;
      this.modifiedImage = encodedModifiedImage;

      this.generateCanvas();
    }
  }

  generateRandomQuery(imageBody: string): RegExp {
    const substrLength = Math.floor(Math.random() * 3);
    const startIndex = Math.floor(
      Math.random() * (imageBody.length - substrLength)
    );
    const queryStr = imageBody.substr(startIndex, substrLength);
    return new RegExp(queryStr, "g");
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
