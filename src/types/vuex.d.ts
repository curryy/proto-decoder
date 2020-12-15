import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import protobufjs from "protobufjs";

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    protosData: protobufjs.Root[];
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
