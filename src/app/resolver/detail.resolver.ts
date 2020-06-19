import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ModifiedImage, OriginalImage } from "../models";
import { Observable, of } from "rxjs";
import { SettingsService } from "../services/settings.service";

export type DatailResponse = {
  originalImage: OriginalImage;
  mutatedImage: ModifiedImage;
};

@Injectable()
export class DetailResolver implements Resolve<DatailResponse> {
  constructor(private settings: SettingsService) {}

  resolve(route: ActivatedRouteSnapshot): DatailResponse {
    const id = route.params["id"];
    const mutatedImage: ModifiedImage = this.settings.generatedImages.find(
      (img) => img.id === id
    );
    const originalImage = this.settings.originalImages.find(
      (img) => img.id === mutatedImage.original
    );
    return {
      originalImage,
      mutatedImage,
    };
  }
}
