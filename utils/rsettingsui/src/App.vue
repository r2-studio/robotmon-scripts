<template>
  <v-app>
    <div v-for="(config, i) in configs" :key="i">
      <UIView :config="config"></UIView>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { UISetting } from "./models/settings";
import UIView from "./components/ui.vue";

@Component({
  components: {
    UIView,
  },
})
export default class App extends Vue {
  @Prop()
  public configs!: UISetting[];
}
</script>
