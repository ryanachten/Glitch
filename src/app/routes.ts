import { Routes } from "@angular/router";
import { GalleryComponent } from "./components/gallery/gallery.component";
import { DetailComponent } from "./components/detail/detail.component";
import { DetailResolver } from "./resolver/detail.resolver";

export const routePaths = {
  mutation: "mutation",
};

export const routes: Routes = [
  { path: "", component: GalleryComponent },
  {
    path: "mutation/:id",
    component: DetailComponent,
    resolve: { image: DetailResolver },
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
