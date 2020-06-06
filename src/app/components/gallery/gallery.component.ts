import { Component, OnInit } from "@angular/core";
import {
  ModifiedImage,
  Settings,
  MutationId,
  Mutator,
  Mutation,
} from "src/app/models";
import { EncodingService } from "src/app/services/encoding.service";
import { GlitchService } from "src/app/services/glitch.service";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.less"],
})
export class GalleryComponent implements OnInit {
  originalImage: string;
  epoch = 0;
  generationSize = 6;
  generatedImages: Array<ModifiedImage> = [];

  constructor(
    public encodingService: EncodingService,
    private glitchService: GlitchService
  ) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const {
        originalImage,
        generationSize,
        generatedImages,
        maxReplaceLength,
        epoch,
        mimeType,
        dataHeader,
      }: Settings = JSON.parse(settings);
      this.originalImage = originalImage;
      this.generationSize = generationSize;
      this.generatedImages = generatedImages;
      this.encodingService.mimeType = mimeType;
      this.maxReplaceLength = maxReplaceLength;
      this.encodingService.dataHeader = dataHeader;
      this.epoch = epoch;
    }
  }

  saveSettings() {
    const settings: Settings = {
      originalImage: this.originalImage,
      generationSize: this.generationSize,
      generatedImages: this.generatedImages,
      maxReplaceLength: this.maxReplaceLength,
      dataHeader: this.encodingService.dataHeader,
      mimeType: this.encodingService.mimeType,
      epoch: this.epoch,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
  }

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
      this.encodingService.setDataHeader(encodedUri);
      this.originalImage = encodedUri;
    };
    fileReader.readAsDataURL(files[0]);
  }

  resetEvolution() {
    this.generatedImages = [];
    this.epoch = 0;
    this.saveSettings();
  }

  async createGeneration(mutationId: MutationId) {
    const Mutator = this.glitchService.getMutatorById(mutationId);
    for (let i = 0; i < this.generationSize; i++) {
      const existingImage = this.generatedImages[i];
      const image = await this.mutateImage(
        Mutator,
        // If image does not exist at index, create new one
        existingImage || {
          mutations: [],
          imageData: this.originalImage,
        }
      );
      // If image already exists, replace it with updated img
      existingImage
        ? (this.generatedImages[i] = image)
        : this.generatedImages.push(image);
    }

    this.epoch = this.epoch + 1;
    this.saveSettings();
  }

  async redoGeneration() {
    this.generatedImages.map(async (existingImage, index) => {
      const { id }: Mutation = existingImage.mutations[
        existingImage.mutations.length - 1
      ];
      const Mutator: Mutator = this.glitchService.getMutatorById(id);
      let image = await this.undoMutation(existingImage);
      image = await this.mutateImage(Mutator, image);
      this.generatedImages[index] = image;
    });
    this.saveSettings();
  }

  async previousGeneration() {
    this.generatedImages.map(async (existingImage, index) => {
      const image = await this.undoMutation(existingImage);
      this.generatedImages[index] = image;
    });
    this.epoch = this.epoch - 1;
    this.saveSettings();
  }

  async undoMutation({ mutations }: ModifiedImage) {
    const decodedUri = this.encodingService.decodeData(this.originalImage);
    const previousMutations = mutations.slice(0, -1);

    let currentImageData = decodedUri;
    previousMutations.map(async (mutation: Mutation) => {
      const mutationId: MutationId = mutation.id;
      const Mutator: Mutator = this.glitchService.getMutatorById(mutationId);
      const { updatedImage } = Mutator.exec(currentImageData, mutation);
      currentImageData = updatedImage;
    });

    const encodedImageData = this.encodingService.encodeData(currentImageData);
    const modifiedImage: ModifiedImage = {
      mutations: previousMutations,
      imageData: encodedImageData,
    };
    return modifiedImage;
  }

  async mutateImage(
    Mutator: Mutator,
    { imageData, mutations }: ModifiedImage
  ): Promise<ModifiedImage> {
    const decodedUri = this.encodingService.decodeData(imageData);
    // TODO: maxLength param should be governed by UI
    const mutation: Mutation = Mutator.seed(decodedUri, 10);
    const { updatedImage, mutationData } = Mutator.exec(decodedUri, mutation);
    const encodedImage = this.encodingService.encodeData(updatedImage);

    const modifiedImage: ModifiedImage = {
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
