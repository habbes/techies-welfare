import { createApp } from 'vue'
import "mosha-vue-toastify/dist/style.css";
import App from './App.vue'
import "./styles/index.css"
import { makeRouter } from "./router/router";
import { registerUiComponents } from "./ui-components";
import { authService } from "./auth";

const app = createApp(App);
const router = makeRouter(authService);
app.use(router);
registerUiComponents(app);

app.mount('#app');
