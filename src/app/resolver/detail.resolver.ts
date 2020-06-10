import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ModifiedImage } from "../models";
import { Observable, of } from "rxjs";
import { SettingsService } from "../services/settings.service";

@Injectable()
export class DetailResolver implements Resolve<ModifiedImage> {
  constructor(private settings: SettingsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ModifiedImage> {
    const id = route.params["id"];
    const activeImage = this.settings.generatedImages.find(
      (img) => img.id === id
    );
    return of(activeImage);
  }
}
