import { createApp } from 'vue'
import App from './App.vue'
import "./styles/index.css"
import { router } from "./router/router";
import { registerUiComponents } from "./ui-components";

const app = createApp(App);
app.use(router);
registerUiComponents(app);

app.mount('#app');
