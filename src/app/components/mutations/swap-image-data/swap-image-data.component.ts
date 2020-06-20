import { Component, EventEmitter, Output, Input, OnInit } from "@angular/core";
import { Mutator, Mutation } from "src/app/models";
import { SettingsService } from "src/app/services/settings.service";
import { Mutations } from "src/app/constants";

export type SwapMutation = Mutation & {
  aIndex: number;
  bIndex: number;
  swapLength: number;
};

type Settings = {
  maxSwapLength: number;
};

@Component({
  selector: "app-swap-image-data",
  templateUrl: "./swap-image-data.component.html",
  styleUrls: ["./swap-image-data.component.less"],
})
export class SwapImageDataComponent implements OnInit, Mutator {
  @Input() maxLength: number;
  @Output() onCreateGeneration = new EventEmitter();
  mutation: Mutation = {
    id: Mutations.SwapImageData.id,
    name: Mutations.SwapImageData.name,
  };

  constructor(public settings: SettingsService) {}

  ngOnInit() {}

  onCreateClick() {
    this.onCreateGeneration.emit(this.mutation.id);
  }

  public seed(imageData: string): SwapMutation {
    const { maxSwapLength } = this.settings.mutations[
      this.mutation.id
    ] as Settings;
    const swapLength = Math.floor(Math.random() * maxSwapLength) || 1;

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
    return `${head}${b}${middle}${a}${tail}`;
  }
}
