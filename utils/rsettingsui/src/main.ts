import Vue from "vue";
import App from "./App.vue";
import { UISetting } from "./models/settings";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = true;

const defaultConfigs: UISetting[] = [
  {
    name: "v-app-bar",
    props: {
      app: true,
    },
    children: [
      {
        name: "v-toolbar-title",
        children: ["Simple Settings"],
      },
    ],
  },
  {
    name: "v-main",
    children: [
      {
        name: "v-container",
        children: [
          {
            name: "v-card",
            children: [
              {
                name: "v-card-title",
                children: ["Settings Group 1"],
              },
              {
                name: "v-spacer",
              },
              {
                name: "v-card-text",
                children: [
                  {
                    name: "v-checkbox",
                    props: {
                      label: "Checkbox a",
                    },
                  },
                  {
                    name: "v-slider",
                    props: {
                      label: "Slider a",
                      max: 10,
                      min: 1,
                      ticks: true,
                      "thumb-label": "always",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function rsettingsui(
  target: string,
  configs: UISetting[] | undefined
) {
  if (configs === undefined) {
    configs = defaultConfigs;
  }
  new Vue({
    vuetify,
    render: (h) => h(App, { props: { configs } }),
  }).$mount(target);
}
