import { computed } from "vue";

export const BUTTON_BASE_CLASSES = "rounded-sm inline-flex h-8 justify-center items-center text-white px-3 py-2 disabled:bg-disabled text-sm";

export type ButtonBasePropsDefinition = {
    full: BooleanConstructor,
    submit: BooleanConstructor,
    primary: BooleanConstructor,
    secondary: BooleanConstructor
}

export interface ButtonBaseProps {
    full: boolean;
    submit: boolean;
    primary: boolean;
    secondary: boolean;
}

export function getButtonBasePropsDefinition(): ButtonBasePropsDefinition {
    return {
        full: Boolean,
        submit: Boolean,
        primary: Boolean,
        secondary: Boolean,
    };
}

const baseClassesObject = BUTTON_BASE_CLASSES.split(" ").reduce((acc, klass) => ({...acc, [klass]: true }), {});

export function getButtonThemeClasses(props: ButtonBaseProps) {
    const classes = computed(() => {
        const primary = props.primary || !(props.secondary);
        return {
          ...baseClassesObject,
          "w-full": props.full,
          "bg-primary": primary,
          "hover:bg-primary-light": primary,
          "focus:bg-primary-dark": primary,
          "bg-secondary": props.secondary,
          "hover:bg-secondary-light": props.secondary,
          "hover:bg-secondary-dark": props.secondary
        }
      });
    
    return classes;
}