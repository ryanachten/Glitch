import { Component, OnInit } from "@angular/core";
import { Mutator, Mutation, MutationId } from "src/app/models";

export type ReplacementMutation = Mutation & {
  replacementQuery: string;
  replacementText: string;
  replacementMatches?: number;
};

@Component({
  selector: "app-find-and-replace",
  templateUrl: "./find-and-replace.component.html",
  styleUrls: ["./find-and-replace.component.scss"],
})
export class FindAndReplaceComponent implements OnInit, Mutator {
  constructor() {}

  ngOnInit() {}

  public seed(
    imageBody: string,
    maxReplaceLength: number
  ): ReplacementMutation {
    const substrLength = Math.floor(Math.random() * maxReplaceLength) || 1;

    const replaceIndex =
      Math.floor(Math.random() * (imageBody.length - substrLength)) || 1;
    const replacementText = imageBody.substr(replaceIndex, substrLength);

    let queryStr: string;
    const setQueryStr = () => {
      const startIndex =
        Math.floor(Math.random() * (imageBody.length - substrLength)) || 1;
      queryStr = imageBody.substr(startIndex, substrLength);
    };
    setQueryStr();

    // Random query string sometimes produces invalid regex
    // keep randomly generating until a valid one is produced
    let replaceRegex: RegExp;
    while (!replaceRegex) {
      try {
        const tmpRegex = new RegExp(queryStr, "g");
        replaceRegex = tmpRegex;
      } catch (error) {
        setQueryStr();
      }
    }

    return {
      id: MutationId.FindAndReplace,
      replacementText,
      replacementQuery: replaceRegex.source,
    };
  }

  public exec(
    imageData: string,
    { replacementQuery, replacementText }: ReplacementMutation
  ) {
    const replaceRegex: RegExp = new RegExp(replacementQuery, "g");
    const replacementMatches = imageData.match(replaceRegex);
    const updatedImage = imageData.replace(replaceRegex, replacementText);
    return {
      updatedImage,
      mutationData: {
        replacementMatches: replacementMatches ? replacementMatches.length : 0,
      },
    };
  }
}
