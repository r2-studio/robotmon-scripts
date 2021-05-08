<template>
  <component
    :is="config.name"
    v-bind="config.props || {}"
    v-on="config.events || {}"
    v-model="config.value"
  >
    <template v-if="config.children && config.children.length > 0">
      <div v-for="(child, i) in config.children" :key="i">
        <span v-if="typeof child === 'string'">{{ child }}</span>
        <UIView v-else :config="child"></UIView>
      </div>
    </template>
  </component>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UISetting } from "../models/settings";
import * as vuetifyLibrary from "vuetify/lib";

const components: { [name: string]: any } = {};
for (const name in vuetifyLibrary) {
  if (name[0] === "V") {
    components[name] = (vuetifyLibrary as any)[name];
  }
}

@Component({
  components,
})
export default class UIView extends Vue {
  @Prop()
  public config!: UISetting;
}
</script>
