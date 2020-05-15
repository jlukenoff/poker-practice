import Vue from "vue";
import App from "./Components/App";

Vue.config.productionTip = false;

const app = new Vue({ render: (h) => h(App) });

app.$mount("#app");

export default app;
