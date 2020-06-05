import { ReplacementMutation } from "../utilities/mutations/FindAndReplace";
import { SwapMutation } from "../utilities/mutations/SwapImageData";

export enum MutationId {
  FindAndReplace = "FindAndReplace",
  SwapImageData = "SwapImageData",
}

// TODO: maxLength should be more generic
export interface Mutator {
  seed: (imageData: string, maxLength: number) => Mutation;
  exec: (
    inputImage: string,
    mutation: Mutation
  ) => { updatedImage: string; mutationData?: any };
}

export type Mutation = ReplacementMutation | SwapMutation;

export type ModifiedImage = {
  imageData: string;
  mutations: Array<Mutation>;
};

export interface Settings {
  originalImage: string;
  epoch: number;
  generationSize: number;
  generatedImages: Array<ModifiedImage>;
  maxReplaceLength: number;
  dataHeader: string;
  mimeType: string;
}
