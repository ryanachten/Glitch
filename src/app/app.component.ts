import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  image: any;

  uploadImage(event) {
    const files = event.target.files;
    const fileReader: FileReader = new FileReader();
    fileReader.onload = e => {
      this.image = e.target.result;
    };
    fileReader.readAsDataURL(files[0]);
  }
}
