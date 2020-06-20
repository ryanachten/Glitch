import { Component, OnInit } from "@angular/core";
import { SettingsService } from "src/app/services/settings.service";
import { EncodingService } from "src/app/services/encoding.service";
import { OriginalImage, PageTemplate } from "src/app/models";

@Component({
  selector: "app-orginals",
  templateUrl: "./orginals.component.html",
  styleUrls: ["./orginals.component.less"],
})
export class OrginalsComponent implements OnInit, PageTemplate {
  breadcrumb = [];
  pageTitle = "Original Media";
  pageSubtitle = "Upload files";
  error: string;

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
    const file: File = files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onload = () => {
      if (!fileReader.result) {
        return null;
      }
      if (this.settings.originalImages.find((f) => f.id === file.name)) {
        this.error = "File already exists";
        return null;
      }

      const encodedUri = fileReader.result.toString();
      const { dataHeader, mimeType } = this.encoding.getDataHeader(encodedUri);
      const originalImage: OriginalImage = {
        id: file.name,
        dataHeader,
        mimeType,
        imageData: encodedUri,
      };
      this.settings.originalImages.push(originalImage);
      this.settings.save();
      this.error = undefined;
    };
    fileReader.readAsDataURL(file);
  }
}
