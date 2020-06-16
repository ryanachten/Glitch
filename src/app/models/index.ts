export const Mutations: {
  [mutation: string]: {
    id: string;
    name: string;
  };
} = {
  FindAndReplace: {
    id: "FindAndReplace",
    name: "Find and Replace",
  },
  SwapImageData: {
    id: "SwapImageData",
    name: "Swap Image Data",
  },
};

export interface Mutator {
  mutation: Mutation;
  seed: (imageData: string) => Mutation;
  exec: (inputImage: string, mutation: Mutation) => string;
}

export interface Mutation {
  id: string;
  name: string;
  corrupted?: boolean;
}

export type ModifiedImage = {
  id: string;
  mutations: Array<Mutation>;
};

export type OriginalImage = {
  id: string;
  mimeType: string;
  dataHeader: string;
  imageData: string;
};

export interface Settings {
  originalImages: Array<OriginalImage>;
  epoch: number;
  generationSize: number;
  generatedImages: Array<ModifiedImage>;
  dataHeader: string;
  mimeType: string;
}
