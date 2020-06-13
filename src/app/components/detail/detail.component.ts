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

  ngOnInit() {
    const image = this.route.data["value"]["image"];
    this.currentImage = image;
    this.mutations = [...image.mutations];
  }

  onPlayHistory() {
    const animationInterval = setInterval(() => {
      let mutations = this.currentImage.mutations;
      mutations.length > 0
        ? mutations.pop()
        : (mutations = [...this.mutations]);

      this.currentImage = {
        ...this.currentImage,
        mutations,
      };
    }, 200);
  }
}
