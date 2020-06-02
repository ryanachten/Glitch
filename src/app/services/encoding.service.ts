import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EncodingService {
  dataHeader: string;
  mimeType: string;

  constructor() {}

  setDataHeader(dataUri: string) {
    const mimeRegex = /data:(.*);base64,/;
    const regexMatches = mimeRegex.exec(dataUri);
    if (regexMatches && regexMatches.length) {
      this.dataHeader = regexMatches[0];
      this.mimeType = regexMatches[1];
    }
  }

  encodeData(unencodedData: string): string {
    return `${this.dataHeader}${btoa(unencodedData)}`;
  }

  decodeData(encodedData: string) {
    return atob(encodedData.replace(this.dataHeader, ""));
  }
}
