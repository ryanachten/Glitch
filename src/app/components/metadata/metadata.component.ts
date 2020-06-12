import { Component, OnInit, Input } from "@angular/core";
import { ModifiedImage, Mutation, MutationId } from "src/app/models";
import { ReplacementMutation } from "../mutations/find-and-replace/find-and-replace.component";
import { SwapMutation } from "../mutations/swap-image-data/swap-image-data.component";

@Component({
  selector: "app-metadata",
  templateUrl: "./metadata.component.html",
  styleUrls: ["./metadata.component.less"],
})
export class MetadataComponent implements OnInit {
  @Input() modifiedImage: ModifiedImage;

  // Mutations
  findAndReplace: ReplacementMutation;
  swapImageData: SwapMutation;

  constructor() {}

  ngOnInit() {
    this.setMutationById();
  }

  setMutationById() {
    const mutations = this.modifiedImage.mutations;
    const activeMutation: Mutation = mutations[mutations.length - 1];
    switch (activeMutation.id) {
      case MutationId.FindAndReplace:
        return (this.findAndReplace = activeMutation as ReplacementMutation);

      case MutationId.SwapImageData:
        return (this.swapImageData = activeMutation as SwapMutation);

      default:
        break;
    }
  }
}
