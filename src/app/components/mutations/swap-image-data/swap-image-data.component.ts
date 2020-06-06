import { Component, EventEmitter, Output } from "@angular/core";
import { Mutator, Mutation, MutationId } from "src/app/models";

export type SwapMutation = Mutation & {
  aIndex: number;
  bIndex: number;
  swapLength: number;
};

@Component({
  selector: "app-swap-image-data",
  templateUrl: "./swap-image-data.component.html",
  styleUrls: ["./swap-image-data.component.less"],
})
export class SwapImageDataComponent implements Mutator {
  @Output() onCreateGeneration = new EventEmitter();
  mutation: Mutation = {
    id: MutationId.SwapImageData,
    name: "Swap Image Data",
  };
  maxSwapLength = 6;

  constructor() {}

  onCreateClick() {
    this.onCreateGeneration.emit(this.mutation.id);
  }

  public seed(imageData: string): SwapMutation {
    const swapLength = Math.floor(Math.random() * this.maxSwapLength) || 1;
    const aIndex = Math.floor((Math.random() * imageData.length) / 2);
    const bIndex =
      Math.floor((Math.random() * imageData.length) / 2) + imageData.length;
    return {
      id: this.mutation.id,
      name: this.mutation.name,
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
