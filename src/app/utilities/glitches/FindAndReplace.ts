import { Mutator, ReplacementMutation } from "src/app/models";

export class FindAndReplace implements Mutator {
  constructor() {}

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
      replacementText,
      replacementQuery: replaceRegex.source,
    };
  }

  public exec(imageData: string, replaceRegex: RegExp, replaceStr: string) {
    const replacementMatches = imageData.match(replaceRegex);
    const updatedImage = imageData.replace(replaceRegex, replaceStr);
    return {
      updatedImage,
      mutationData: {
        replacementMatches: replacementMatches ? replacementMatches.length : 0,
      },
    };
  }
}
