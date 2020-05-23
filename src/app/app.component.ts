import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  originalImage: any;

  uploadImage(event) {
    const files = event.target.files;
    const fileReader: FileReader = new FileReader();
    fileReader.onload = e => {
      const encodedUri = e.target.result as string;
      const dataHeader = "data:image/jpeg;base64,";
      const decodedUri = atob(encodedUri.replace(dataHeader, ""));
      const modifiedImage = decodedUri.toString().replace(/bc/g, "cd");
      const encodedModifiedImage = `${dataHeader}${btoa(modifiedImage)}`;
      this.originalImage = encodedModifiedImage;

      this.generateCanvas();
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
      // console.log(canvas.toDataURL());
    };
    image.src = this.originalImage;
  }
}
