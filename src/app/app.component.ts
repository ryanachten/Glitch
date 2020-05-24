import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  originalImage: any;

  generateRandomQuery(imageBody: string) {
    const substrLength = Math.floor(Math.random() * 10);
    const startIndex = Math.floor(
      Math.random() * (imageBody.length - substrLength)
    );
    const queryStr = imageBody.substr(startIndex, substrLength);
    return new RegExp(queryStr, "g");
  }

  uploadImage(event) {
    const files = event.target.files;
    const fileReader: FileReader = new FileReader();
    fileReader.onload = e => {
      const encodedUri = e.target.result.toString();
      const dataHeader = "data:image/jpeg;base64,";
      const decodedUri = atob(encodedUri.replace(dataHeader, ""));
      const replaceRegex = this.generateRandomQuery(decodedUri);
      console.log("replaceRegex", replaceRegex);
      const matches = decodedUri.match(replaceRegex);
      if (matches && matches.length) {
        console.log("matches", matches.length);
        const modifiedImage = decodedUri.replace(replaceRegex, "cd");
        const encodedModifiedImage = `${dataHeader}${btoa(modifiedImage)}`;
        this.originalImage = encodedModifiedImage;

        this.generateCanvas();
      }
    };
    fileReader.readAsDataURL(files[0]);
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
    image.src = this.originalImage;
  }
}
