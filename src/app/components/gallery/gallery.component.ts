import { Component, OnInit } from "@angular/core";
import * as uuid from "uuid";
import {
  ModifiedImage,
  Mutator,
  Mutation,
  OriginalImage,
} from "src/app/models";
import { EncodingService } from "src/app/services/encoding.service";
import { GlitchService } from "src/app/services/glitch.service";
import { SettingsService } from "src/app/services/settings.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.less"],
})
export class GalleryComponent implements OnInit {
  originalImage: OriginalImage;

  constructor(
    public settings: SettingsService,
    public encoding: EncodingService,
    private glitch: GlitchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const image = this.route.data["value"]["image"];
    this.originalImage = image;
  }

  resetEvolution() {
    this.settings.generatedImages = [];
    this.settings.epoch = 0;
    this.settings.save();
  }

  async createGeneration(mutationId: string) {
    const Mutator = this.glitch.getMutatorById(mutationId);
    for (let i = 0; i < this.settings.generationSize; i++) {
      const existingImage = this.settings.generatedImages[i];
      const image = await this.mutateImage(
        Mutator,
        // If image does not exist at index, create new one
        existingImage || {
          id: uuid.v4(),
          mutations: [],
          original: this.originalImage.id,
        }
      );
      // If image already exists, replace it with updated img
      existingImage
        ? (this.settings.generatedImages[i] = image)
        : this.settings.generatedImages.push(image);
    }

    this.settings.epoch = this.settings.epoch + 1;
    this.settings.save();
  }

  async redoGeneration() {
    this.settings.generatedImages.map(async (existingImage, index) => {
      const { id }: Mutation = existingImage.mutations[
        existingImage.mutations.length - 1
      ];
      const Mutator: Mutator = this.glitch.getMutatorById(id);
      let image = await this.undoMutation(existingImage);
      image = await this.mutateImage(Mutator, image);
      this.settings.generatedImages[index] = image;
    });
    this.settings.save();
  }

  async previousGeneration() {
    this.settings.generatedImages.map(async (existingImage, index) => {
      const image = await this.undoMutation(existingImage);
      this.settings.generatedImages[index] = image;
    });
    this.settings.epoch = this.settings.epoch - 1;
    this.settings.save();
  }

  async undoMutation(originalImage: ModifiedImage) {
    const { mutations } = originalImage;
    const previousMutations = mutations.slice(0, -1);
    const modifiedImage: ModifiedImage = {
      ...originalImage,
      mutations: previousMutations,
    };
    return modifiedImage;
  }

  async mutateImage(
    Mutator: Mutator,
    originalImage: ModifiedImage
  ): Promise<ModifiedImage> {
    const { mutations } = originalImage;
    const imageData = await this.glitch.getUrlFromMutations(
      this.originalImage,
      mutations
    );
    const decodedUri = this.encoding.decodeData(imageData);

    const mutation: Mutation = Mutator.seed(decodedUri);
    mutations.push(mutation);

    const modifiedImage: ModifiedImage = {
      ...originalImage,
      mutations,
    };
    return modifiedImage;
  }
}
