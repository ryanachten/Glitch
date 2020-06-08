import { Routes } from "@angular/router";
import { GalleryComponent } from "./components/gallery/gallery.component";

export const routes: Routes = [
  { path: "", component: GalleryComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
