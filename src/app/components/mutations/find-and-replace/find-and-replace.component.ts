import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";
import { Mutator, Mutation } from "src/app/models";
import { SettingsService } from "src/app/services/settings.service";
import { Mutations } from "src/app/constants";

export type ReplacementMutation = Mutation & {
  replacementQuery: string;
  replacementText: string;
  replacementMatches?: number;
};

type Settings = {
  replaceLength: number;
};

@Component({
  selector: "app-find-and-replace",
  templateUrl: "./find-and-replace.component.html",
  styleUrls: ["./find-and-replace.component.less"],
})
export class FindAndReplaceComponent implements OnInit, Mutator {
  @Input() maxLength: number;
  @Output() onCreateGeneration = new EventEmitter();

  mutation: Mutation = {
    id: Mutations.FindAndReplace.id,
    name: Mutations.FindAndReplace.name,
  };

  constructor(public settings: SettingsService) {}

  ngOnInit() {}

  onCreateClick() {
    this.onCreateGeneration.emit(this.mutation.id);
  }

  public seed(imageBody: string): ReplacementMutation {
    const { replaceLength } = this.settings.mutations[
      this.mutation.id
    ] as Settings;

    const replaceIndex =
      Math.floor(Math.random() * (imageBody.length - replaceLength)) || 1;
    const replacementText = imageBody.substr(replaceIndex, replaceLength);

    let queryStr: string;
    const setQueryStr = () => {
      const startIndex =
        Math.floor(Math.random() * (imageBody.length - replaceLength)) || 1;
      queryStr = imageBody.substr(startIndex, replaceLength);
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

    const replacementQuery = replaceRegex.source;
    const queryMatches = imageBody.match(replaceRegex);
    const matchCount = queryMatches ? queryMatches.length : 0;

    return {
      id: this.mutation.id,
      name: this.mutation.name,
      replacementText,
      replacementQuery,
      replacementMatches: matchCount,
    };
  }

  public exec(
    imageData: string,
    { replacementQuery, replacementText }: ReplacementMutation
  ) {
    const replaceRegex: RegExp = new RegExp(replacementQuery, "g");
    const updatedImage = imageData.replace(replaceRegex, replacementText);
    return updatedImage;
  }
}
