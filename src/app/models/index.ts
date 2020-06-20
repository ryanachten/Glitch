export type AppRoute = {
  path: string;
  params?: string;
  label: string;
};

export interface PageTemplate {
  breadcrumb: Array<AppRoute>;
  pageTitle: string;
  pageSubtitle: string;
}

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
  original: string;
  mutations: Array<Mutation>;
};

export type OriginalImage = {
  id: string;
  mimeType: string;
  dataHeader: string;
  imageData: string;
  height: number;
  width: number;
  size: number;
};
