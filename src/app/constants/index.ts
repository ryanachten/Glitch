import { AppRoute } from "../models";

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
