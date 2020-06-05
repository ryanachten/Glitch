import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CanvasComponent } from './components/canvas/canvas.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { FindAndReplaceComponent } from './components/mutations/find-and-replace/find-and-replace.component';
import { SwapImageDataComponent } from './components/mutations/swap-image-data/swap-image-data.component';

@NgModule({
  declarations: [AppComponent, CanvasComponent, GalleryComponent, FindAndReplaceComponent, SwapImageDataComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
