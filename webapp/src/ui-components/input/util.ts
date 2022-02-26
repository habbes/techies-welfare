const baseClassString = "inline-flex px-3 py-2 border border-tertiary-light rounded-sm shadow-sm h-8" +
        " focus:border-primary focus:outline-none text-secondary";
    
    const baseClasses = baseClassString.split(" ").reduce((prev, className) => ({ ...prev, [className]: true }),
        {} as Record<string, boolean>);

export function getTextFieldCommonProps() {
    return {
        full: Boolean,
        label: String,
        placeholder: String,
        required: Boolean
    }
}

export function getTextFieldCommonClasses(props: { full?: boolean }) {
    

    return {
        ...baseClasses,
        "w-full": props.full,
        "w-72": !props.full,
    }
}
