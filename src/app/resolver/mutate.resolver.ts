import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { OriginalImage } from "../models";
import { Observable, of } from "rxjs";
import { SettingsService } from "../services/settings.service";

@Injectable()
export class MutateResolver implements Resolve<OriginalImage> {
  constructor(private settings: SettingsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<OriginalImage> {
    const id = route.params["id"];
    const originalImage = this.settings.originalImages.find(
      (img) => img.id === id
    );
    return of(originalImage);
  }
}
