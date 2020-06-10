import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModifiedImage } from "src/app/models";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.less"],
})
export class DetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  image: ModifiedImage;

  ngOnInit() {
    this.image = this.route.data["value"]["image"];
  }
}
