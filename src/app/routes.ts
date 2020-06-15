import { Routes } from "@angular/router";
import { GalleryComponent } from "./components/gallery/gallery.component";
import { DetailComponent } from "./components/detail/detail.component";
import { DetailResolver } from "./resolver/detail.resolver";
import { OrginalsComponent } from "./pages/orginals/orginals.component";

export const routePaths = {
  mutation: "mutation",
};

export const routes: Routes = [
  { path: "", component: OrginalsComponent },
  { path: "originals", component: OrginalsComponent },
  {
    path: "mutation/:id",
    component: DetailComponent,
    resolve: { image: DetailResolver },
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
