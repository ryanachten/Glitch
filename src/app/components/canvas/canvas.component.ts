import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ModifiedImage, ReplacementMutation } from "src/app/models";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.scss"],
})
export class CanvasComponent implements OnInit {
  @Input() modifiedImage: ModifiedImage;
  @ViewChild("canvas", { static: true }) canvasElement;
  imageElement: HTMLImageElement;
  mutation: ReplacementMutation;

  constructor() {}

  ngOnInit() {
    this.renderImage();
  }

  loadImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = this.modifiedImage.imageData;
      img.onload = () => {
        this.imageElement = img;
        resolve();
      };
    });
  }

  async renderImage() {
    await this.loadImage();
    const mutations = this.modifiedImage.mutations;
    this.mutation = mutations[mutations.length - 1];
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext("2d");
    const image = this.imageElement;
    canvas.height = image.height;
    canvas.width = image.width;
    ctx.drawImage(image, 0, 0, image.width, image.height);
  }
}
