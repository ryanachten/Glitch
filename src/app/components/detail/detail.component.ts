import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModifiedImage, Mutation } from "src/app/models";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.less"],
})
export class DetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  currentImage: ModifiedImage;
  mutations: Mutation[];
  animation: NodeJS.Timer;

  ngOnInit() {
    const image = this.route.data["value"]["image"];
    this.currentImage = image;
    this.mutations = [...image.mutations];
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
