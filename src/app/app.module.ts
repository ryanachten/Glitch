import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzSliderModule } from "ng-zorro-antd/slider";
import { NzStepsModule } from "ng-zorro-antd/steps";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { GalleryComponent } from "./components/gallery/gallery.component";
import { FindAndReplaceComponent } from "./components/mutations/find-and-replace/find-and-replace.component";
import { SwapImageDataComponent } from "./components/mutations/swap-image-data/swap-image-data.component";
import { DetailResolver } from "./resolver/detail.resolver";
import { RouterModule } from "@angular/router";
import { routes } from "./routes";
import { DetailComponent } from "./components/detail/detail.component";
import { MetadataComponent } from "./components/metadata/metadata.component";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    GalleryComponent,
    FindAndReplaceComponent,
    SwapImageDataComponent,
    DetailComponent,
    MetadataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgZorroAntdModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    NzButtonModule,
    NzFormModule,
    NzInputNumberModule,
    NzSliderModule,
    NzStepsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, DetailResolver],
  bootstrap: [AppComponent],
})
export class AppModule {}
