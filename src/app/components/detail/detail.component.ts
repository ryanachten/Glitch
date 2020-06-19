import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  ModifiedImage,
  Mutation,
  OriginalImage,
  PageTemplate,
  AppRoutes,
} from "src/app/models";
import { DatailResponse } from "src/app/resolver/detail.resolver";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.less"],
})
export class DetailComponent implements OnInit, PageTemplate {
  constructor(private route: ActivatedRoute) {}
  breadcrumb = [AppRoutes.home];
  orignalImage: OriginalImage;
  currentImage: ModifiedImage;
  mutations: Mutation[];
  animation: NodeJS.Timer;

  ngOnInit() {
    const data: DatailResponse = this.route.data["value"]["data"];
    const { mutatedImage, originalImage } = data;

    this.currentImage = mutatedImage;
    this.orignalImage = originalImage;
    this.breadcrumb.push(
      { ...AppRoutes.mutate, params: this.orignalImage.id },
      { ...AppRoutes.mutation, params: this.currentImage.id }
    );
    this.mutations = [...mutatedImage.mutations];
  }

  onPlayHistory() {
    this.currentImage = {
      ...this.currentImage,
      mutations: [],
    };
    this.animation = setInterval(() => {
      let mutations = this.currentImage.mutations;
      mutations.length === this.mutations.length
        ? (mutations = [])
        : mutations.push(this.mutations[mutations.length]);

      this.currentImage = {
        ...this.currentImage,
        mutations,
      };
    }, 500);
  }

  onPauseHistory() {
    clearInterval(this.animation);
    this.animation = undefined;
  }
}
