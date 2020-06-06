import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NzButtonModule } from "ng-zorro-antd/button";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { GalleryComponent } from "./components/gallery/gallery.component";
import { FindAndReplaceComponent } from "./components/mutations/find-and-replace/find-and-replace.component";
import { SwapImageDataComponent } from "./components/mutations/swap-image-data/swap-image-data.component";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    GalleryComponent,
    FindAndReplaceComponent,
    SwapImageDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgZorroAntdModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzButtonModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
