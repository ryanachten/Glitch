import { Component, OnInit, Input } from "@angular/core";
import { Mutation } from "src/app/models";
import { ReplacementMutation } from "../mutations/find-and-replace/find-and-replace.component";
import { SwapMutation } from "../mutations/swap-image-data/swap-image-data.component";
import { Mutations } from "src/app/constants";

@Component({
  selector: "app-metadata",
  templateUrl: "./metadata.component.html",
  styleUrls: ["./metadata.component.less"],
})
export class MetadataComponent implements OnInit {
  @Input() mutation: Mutation;

  // Mutations
  findAndReplace: ReplacementMutation;
  swapImageData: SwapMutation;

  constructor() {}

  ngOnInit() {
    this.setMutationById();
  }

  setMutationById() {
    const activeMutation: Mutation = this.mutation;
    switch (activeMutation.id) {
      case Mutations.FindAndReplace.id:
        return (this.findAndReplace = activeMutation as ReplacementMutation);

      case Mutations.SwapImageData.id:
        return (this.swapImageData = activeMutation as SwapMutation);

      default:
        break;
    }
  }
}
