export type ReplacementMutation = {
  replacementQuery: string;
  replacementText: string;
  replacementMatches: number;
};

export type SwapMutation = {
  aIndex: number;
  bIndex: number;
  swapLength: number;
};

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
