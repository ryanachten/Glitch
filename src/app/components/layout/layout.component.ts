import { Component, OnInit, Input } from "@angular/core";
import { AppRoute } from "src/app/models";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.less"],
})
export class LayoutComponent implements OnInit {
  @Input() breadcrumb: Array<AppRoute> = [];
  @Input() pageTitle: string;
  @Input() pageSubtitle: string;

  constructor() {}

  ngOnInit() {}
}
