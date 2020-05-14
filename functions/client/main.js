import Vue from "vue";
import App from "./Components/App";

Vue.config.productionTip = false;

new Vue({ render: (h) => h(App) }).$mount("#app");
