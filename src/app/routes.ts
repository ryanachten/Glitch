import { Routes } from "@angular/router";
import { GalleryComponent } from "./components/gallery/gallery.component";
import { DetailComponent } from "./components/detail/detail.component";
import { DetailResolver } from "./resolver/detail.resolver";
import { OrginalsComponent } from "./pages/orginals/orginals.component";
import { MutateResolver } from "./resolver/mutate.resolver";

export const routes: Routes = [
  { path: "", component: OrginalsComponent },
  { path: "originals", component: OrginalsComponent },
  {
    path: "mutate/:id",
    component: GalleryComponent,
    resolve: { image: MutateResolver },
  },
  {
    path: "mutation/:id",
    component: DetailComponent,
    resolve: { data: DetailResolver },
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
