import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ModifiedImage, Mutation } from "src/app/models";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.scss"],
})
export class CanvasComponent implements OnInit {
  @Input() modifiedImage: ModifiedImage;
  @ViewChild("canvas", { static: true }) canvasElement;
  imageElement: HTMLImageElement;
  mutation: Mutation;
  error: string;

  constructor() {}

  ngOnInit() {
    this.renderImage();
  }

  loadImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = this.modifiedImage.imageData;
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
