import { createApp } from "vue";
import App from "./App.vue";

import "uikit/dist/css/uikit.min.css";
import * as UIkit from "uikit";
import * as Icons from "uikit/dist/js/uikit-icons";
import { key, store } from "./store";

UIkit.use(Icons);
const app = createApp(App);
app.use(store, key);
app.mount("#app");
