export type ReplacementMutation = {
  replacementQuery: string;
  replacementText: string;
  replacementMatches: number;
};

export type ModifiedImage = {
  imageData: string;
  mutations: Array<ReplacementMutation>;
};
