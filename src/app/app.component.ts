import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  // image: any;

  uploadImage(event) {
    const files = event.target.files;
    console.log("files", files);
  }
}
