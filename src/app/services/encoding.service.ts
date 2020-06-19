import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EncodingService {
  constructor() {}

  getDataHeader(dataUri: string) {
    const mimeRegex = /data:(.*);base64,/;
    const regexMatches = mimeRegex.exec(dataUri);
    let dataHeader = null;
    let mimeType = null;
    if (regexMatches && regexMatches.length) {
      dataHeader = regexMatches[0];
      mimeType = regexMatches[1];
    }
    return {
      dataHeader,
      mimeType,
    };
  }

  encodeData(dataHeader: string, unencodedData: string): string {
    return `${dataHeader}${btoa(unencodedData)}`;
  }

  decodeData(dataHeader: string, encodedData: string) {
    return atob(encodedData.replace(dataHeader, ""));
  }
}
