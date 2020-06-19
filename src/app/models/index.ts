export type AppRoute = {
  path: string;
  params?: string;
  label: string;
};

export const AppRoutes: { [route: string]: AppRoute } = {
  home: {
    path: "",
    label: "Home",
  },
  mutate: {
    path: "/mutate/",
    label: "Mutate",
  },
  mutation: {
    path: "/mutation/",
    label: "Mutation",
  },
};

export interface PageTemplate {
  breadcrumb: Array<AppRoute>;
}

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
  original: string;
  mutations: Array<Mutation>;
};

export type OriginalImage = {
  id: string;
  mimeType: string;
  dataHeader: string;
  imageData: string;
};
