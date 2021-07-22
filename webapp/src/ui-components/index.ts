import { App } from "vue";
import UiButton from "./button/button.vue";
import UiRouterButton from "./button/router-button.vue";
import UiCard from "./card/card.vue";
import UiDialog from "./dialog/dialog.vue";
import UiTextInput from "./input/text-input.vue";
import UiTextArea from "./input/text-area.vue";
import UiH2 from "./headings/h2.vue";

export function registerUiComponents(app: App): void {
  app.component("ui-button", UiButton);
  app.component("ui-router-button", UiRouterButton);
  app.component("ui-card", UiCard);
  app.component("ui-dialog", UiDialog);
  app.component("ui-text-input", UiTextInput);
  app.component("ui-text-area", UiTextArea);
  app.component("ui-h2", UiH2);
}
