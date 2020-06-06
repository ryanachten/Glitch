export enum MutationId {
  FindAndReplace = "FindAndReplace",
  SwapImageData = "SwapImageData",
}

export interface Mutator {
  id: MutationId;
  seed: (imageData: string) => Mutation;
  exec: (
    inputImage: string,
    mutation: Mutation
  ) => { updatedImage: string; mutationData?: any };
}

export interface Mutation {
  id: MutationId;
}

export type ModifiedImage = {
  imageData: string;
  mutations: Array<Mutation>;
};

export interface Settings {
  originalImage: string;
  epoch: number;
  generationSize: number;
  generatedImages: Array<ModifiedImage>;
  dataHeader: string;
  mimeType: string;
}
