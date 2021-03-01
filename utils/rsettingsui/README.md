# rsettingsui usage

## Example

```
<meta charset="utf-8" />
<title>rsettingsui demo</title>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/r2-studio/robotmon-scripts/utils/rsettingsui/dist/rsettingsui.css"
/>
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/gh/r2-studio/robotmon-scripts/utils/rsettingsui/dist/rsettingsui.umd.js"></script>
<body>
  <div id="app"></div>
</body>

<script>
  var settings = {
    checkboxA: true,
    sliderA: 3,
  };

  var defaultConfigs = [
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
                      events: {
                        change: function(value) {
                          settings.checkboxA = value;
                        },
                      },
                      value: settings.checkboxA,
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
                      events: {
                        change: function(value) {
                          console.log(value);
                          settings.sliderA = value;
                        },
                      },
                      value: settings.sliderA,
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
  rsettingsui("#app", defaultConfigs);
</script>

```

# rsettingsui develop

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
