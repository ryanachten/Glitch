import { Component } from "@angular/core";
import { SettingsService } from "./services/settings.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  constructor(private settings: SettingsService) {
    this.settings.load();
  }
}
