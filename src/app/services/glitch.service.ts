import { Injectable } from "@angular/core";
import { SwapMutation } from "../models";

@Injectable({
  providedIn: "root",
})
export class GlitchService {
  constructor() {}

  seedReplaceQuery(
    imageBody: string,
    maxReplaceLength: number
  ): {
    replaceString: string;
    replaceRegex: RegExp;
  } {
    const substrLength = Math.floor(Math.random() * maxReplaceLength) || 1;

    const replaceIndex =
      Math.floor(Math.random() * (imageBody.length - substrLength)) || 1;
    const replaceString = imageBody.substr(replaceIndex, substrLength);

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
      replaceString,
      replaceRegex,
    };
  }

  findAndReplace(
    imageData: string,
    replaceRegex: RegExp,
    replaceStr: string
  ): {
    replacementMatches: number;
    updatedImageData: string;
  } {
    const replacementMatches = imageData.match(replaceRegex);
    const updatedImageData = imageData.replace(replaceRegex, replaceStr);
    return {
      updatedImageData,
      replacementMatches: replacementMatches ? replacementMatches.length : 0,
    };
  }

  seedSwapImageMatrix(imageData: string, maxSwapLength: number): SwapMutation {
    const swapLength = Math.floor(Math.random() * maxSwapLength) || 1;
    const aIndex = Math.floor((Math.random() * imageData.length) / 2);
    const bIndex =
      Math.floor((Math.random() * imageData.length) / 2) + imageData.length;
    return {
      aIndex,
      bIndex,
      swapLength,
    };
  }

  swapImageMatrix(
    imageData: string,
    { aIndex, bIndex, swapLength }: SwapMutation
  ) {
    const head = imageData.slice(0, aIndex);
    const a = imageData.slice(aIndex, aIndex + swapLength);
    const middle = imageData.slice(aIndex + swapLength, bIndex);
    const b = imageData.slice(bIndex, bIndex + swapLength);
    const tail = imageData.slice(bIndex + swapLength);
    return `${head}${b}${middle}${a}${tail}`;
  }
}
