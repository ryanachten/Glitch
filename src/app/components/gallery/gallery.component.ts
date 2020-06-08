import { Component, OnInit } from "@angular/core";
import * as uuid from "uuid";
import { ModifiedImage, MutationId, Mutator, Mutation } from "src/app/models";
import { EncodingService } from "src/app/services/encoding.service";
import { GlitchService } from "src/app/services/glitch.service";
import { SettingsService } from "src/app/services/settings.service";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.less"],
})
export class GalleryComponent implements OnInit {
  constructor(
    public settings: SettingsService,
    public encoding: EncodingService,
    private glitch: GlitchService
  ) {}

  ngOnInit() {}

  uploadImage(event) {
    const files = event.target.files;
    if (!files.length) {
      return;
    }
    const fileReader: FileReader = new FileReader();
    fileReader.onload = () => {
      if (!fileReader.result) {
        return null;
      }
      const encodedUri = fileReader.result.toString();
      this.encoding.setDataHeader(encodedUri);
      this.settings.originalImage = encodedUri;
    };
    fileReader.readAsDataURL(files[0]);
  }

  resetEvolution() {
    this.settings.generatedImages = [];
    this.settings.epoch = 0;
    this.settings.save();
  }

  async createGeneration(mutationId: MutationId) {
    const Mutator = this.glitch.getMutatorById(mutationId);
    for (let i = 0; i < this.settings.generationSize; i++) {
      const existingImage = this.settings.generatedImages[i];
      const image = await this.mutateImage(
        Mutator,
        // If image does not exist at index, create new one
        existingImage || {
          id: uuid.v4(),
          mutations: [],
          imageData: this.settings.originalImage,
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
    const decodedUri = this.encoding.decodeData(this.settings.originalImage);
    const previousMutations = mutations.slice(0, -1);

    let currentImageData = decodedUri;
    previousMutations.map(async (mutation: Mutation) => {
      const mutationId: MutationId = mutation.id;
      const Mutator: Mutator = this.glitch.getMutatorById(mutationId);
      const { updatedImage } = Mutator.exec(currentImageData, mutation);
      currentImageData = updatedImage;
    });

    const encodedImageData = this.encoding.encodeData(currentImageData);
    const modifiedImage: ModifiedImage = {
      ...originalImage,
      mutations: previousMutations,
      imageData: encodedImageData,
    };
    return modifiedImage;
  }

  async mutateImage(
    Mutator: Mutator,
    originalImage: ModifiedImage
  ): Promise<ModifiedImage> {
    const { imageData, mutations } = originalImage;
    const decodedUri = this.encoding.decodeData(imageData);
    const mutation: Mutation = Mutator.seed(decodedUri);
    const { updatedImage, mutationData } = Mutator.exec(decodedUri, mutation);
    const encodedImage = this.encoding.encodeData(updatedImage);

    const modifiedImage: ModifiedImage = {
      ...originalImage,
      mutations: [
        ...mutations,
        {
          ...mutation,
          ...mutationData,
        },
      ],
      imageData: encodedImage,
    };
    return modifiedImage;
  }
}
