import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChange,
} from "@angular/core";
import { ModifiedImage } from "src/app/models";
import { Router } from "@angular/router";
import { routePaths } from "src/app/routes";
import { GlitchService } from "src/app/services/glitch.service";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.less"],
})
export class CanvasComponent implements OnInit {
  @Input() modifiedImage: ModifiedImage;
  @ViewChild("canvas", { static: true }) canvasElement;
  imageElement: HTMLImageElement;
  error: string;

  constructor(private router: Router, private glitch: GlitchService) {}

  ngOnInit() {
    this.renderImage();
  }

  ngOnChanges(changes: SimpleChange) {
    this.renderImage();
  }

  async loadImage() {
    const imageUri = await this.glitch.getUrlFromMutations(
      this.modifiedImage.mutations
    );
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUri;
      img.onload = (e) => {
        this.imageElement = img;
        resolve();
      };
      img.onerror = (e) => {
        reject(e);
      };
    });
  }

  async renderImage() {
    try {
      await this.loadImage();
    } catch (error) {
      return (this.error = "Image corrupted!");
    }
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext("2d");
    const image = this.imageElement;
    canvas.height = image.height;
    canvas.width = image.width;
    ctx.drawImage(image, 0, 0, image.width, image.height);
  }

  navigateToDetail() {
    this.router.navigate([routePaths.mutation, this.modifiedImage.id]);
  }
}
