import { Component, OnInit } from "@angular/core";
import * as uuid from "uuid";
import { SettingsService } from "src/app/services/settings.service";
import { EncodingService } from "src/app/services/encoding.service";
import { OriginalImage } from "src/app/models";

@Component({
  selector: "app-orginals",
  templateUrl: "./orginals.component.html",
  styleUrls: ["./orginals.component.less"],
})
export class OrginalsComponent implements OnInit {
  constructor(
    public settings: SettingsService,
    public encoding: EncodingService
  ) {}

  ngOnInit() {}

  uploadImage(event) {
    const files = event.target.files;
    if (!files.length) {
      return;
    }
    const fileReader: FileReader = new FileReader();
    fileReader.onload = () => {
      if (!fileReader.result) {
        return null;
      }
      const encodedUri = fileReader.result.toString();
      const { dataHeader, mimeType } = this.encoding.getDataHeader(encodedUri);
      const originalImage: OriginalImage = {
        id: uuid.v4(),
        dataHeader,
        mimeType,
        imageData: encodedUri,
      };
      this.settings.originalImages.push(originalImage);
      this.settings.save();
    };
    fileReader.readAsDataURL(files[0]);
  }
}
