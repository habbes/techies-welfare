import { App } from "vue";
import UiLayout from "./layout/layout.vue";
import UiButton from "./button/button.vue";
import UiRouterButton from "./button/router-button.vue";
import UiCard from "./card/card.vue";
import UiDialog from "./dialog/dialog.vue";
import UiTextInput from "./input/text-input.vue";
import UiTextArea from "./input/text-area.vue";
import UiInputGroup from "./input/input-group.vue";
import UiH2 from "./headings/h2.vue";
import UiH3 from "./headings/h3.vue";
import UiTable from "./table/table.vue";
import UiTHead from "./table/thead.vue";
import UiTBody from "./table/tbody.vue";
import UiTH from "./table/th.vue";
import UiTR from "./table/tr.vue";
import UiTD from "./table/td.vue";
import UiText from "./text/text.vue";
import UiDropdown from "./dropdown/dropdown.vue";
import UiDropdownItem from "./dropdown/dropdown-item.vue";
import UiChevronDownIcon from "./icons/chevron.vue";

// TODO: registering the components globally
//  makes auto-complete impossible and increases
//  chances of error. We should probably
// just explicitly import each component we need
export function registerUiComponents(app: App): void {
  app.component("ui-button", UiButton);
  app.component("ui-router-button", UiRouterButton);
  app.component("ui-card", UiCard);
  app.component("ui-dialog", UiDialog);
  app.component("ui-text-input", UiTextInput);
  app.component("ui-text-area", UiTextArea);
  app.component("ui-h2", UiH2);
  app.component("ui-h3", UiH3);
  app.component("ui-table", UiTable);
  app.component("ui-thead", UiTHead);
  app.component("ui-tbody", UiTBody);
  app.component("ui-th", UiTH);
  app.component("ui-tr", UiTR);
  app.component("ui-td", UiTD);
  app.component("ui-dropdown", UiDropdown);
}

export {
  UiLayout,
  UiButton,
  UiRouterButton,
  UiCard,
  UiDialog,
  UiInputGroup,
  UiTextInput,
  UiTextArea,
  UiH2,
  UiH3,
  UiTable,
  UiTHead,
  UiTBody,
  UiTH,
  UiTR,
  UiTD,
  UiDropdown,
  UiDropdownItem,
  UiChevronDownIcon,
  UiText,
};
