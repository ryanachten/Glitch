import { Component, Output, EventEmitter } from "@angular/core";
import { Mutator, Mutation, MutationId } from "src/app/models";

export type ReplacementMutation = Mutation & {
  replacementQuery: string;
  replacementText: string;
  replacementMatches?: number;
};

@Component({
  selector: "app-find-and-replace",
  templateUrl: "./find-and-replace.component.html",
  styleUrls: ["./find-and-replace.component.less"],
})
export class FindAndReplaceComponent implements Mutator {
  @Output() onCreateGeneration = new EventEmitter();
  mutation: Mutation = {
    id: MutationId.FindAndReplace,
    name: "Find and replace",
  };
  maxReplaceLength = 6;

  constructor() {}

  onCreateClick() {
    this.onCreateGeneration.emit(this.mutation.id);
  }

  public seed(imageBody: string): ReplacementMutation {
    const substrLength = Math.floor(Math.random() * this.maxReplaceLength) || 1;

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
      id: this.mutation.id,
      name: this.mutation.name,
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
