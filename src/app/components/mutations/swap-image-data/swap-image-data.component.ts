import { Component, OnInit } from "@angular/core";
import { Mutator, Mutation, MutationId } from "src/app/models";

export type SwapMutation = Mutation & {
  aIndex: number;
  bIndex: number;
  swapLength: number;
};

@Component({
  selector: "app-swap-image-data",
  templateUrl: "./swap-image-data.component.html",
  styleUrls: ["./swap-image-data.component.scss"],
})
export class SwapImageDataComponent implements OnInit, Mutator {
  constructor() {}

  ngOnInit() {}

  public seed(imageData: string, maxSwapLength: number): SwapMutation {
    const swapLength = Math.floor(Math.random() * maxSwapLength) || 1;
    const aIndex = Math.floor((Math.random() * imageData.length) / 2);
    const bIndex =
      Math.floor((Math.random() * imageData.length) / 2) + imageData.length;
    return {
      id: MutationId.SwapImageData,
      aIndex,
      bIndex,
      swapLength,
    };
  }

  public exec(imageData: string, { aIndex, bIndex, swapLength }: SwapMutation) {
    const head = imageData.slice(0, aIndex);
    const a = imageData.slice(aIndex, aIndex + swapLength);
    const middle = imageData.slice(aIndex + swapLength, bIndex);
    const b = imageData.slice(bIndex, bIndex + swapLength);
    const tail = imageData.slice(bIndex + swapLength);
    return {
      updatedImage: `${head}${b}${middle}${a}${tail}`,
    };
  }
}
