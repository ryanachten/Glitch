export type ReplacementMutation = {
  replacementQuery: string;
  replacementText: string;
  replacementMatches: number;
};

export type ModifiedImage = {
  imageData: string;
  mutations: Array<ReplacementMutation>;
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
