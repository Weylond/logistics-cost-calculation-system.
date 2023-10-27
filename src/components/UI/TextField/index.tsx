import "./styles.css";

interface TextFieldProps {
  value?: string;
  onChange?: Function;
  onInput?: Function;
  placeholder?: string;
  autoFocus?: boolean;
  name?: string;
  type?: "email" | "password" | "text";
  className?: string;
  id?: string;
  ref: HTMLInputElement | undefined;
  disabled: boolean
}

const TextField = (props: TextFieldProps) => {
  return (
    <input
      type={props.type}
      value={props.value ? props.value : ""}
      name={props.name}
      class={props.className}
      placeholder={props.placeholder}
      onChange={() => props.onChange && props.onChange(props.value)}
      id={props.id}
      onInput={() => props.onInput && props.onInput(props.value)}
      ref={props.ref}
      disabled={props.disabled}
    />
  );
};

export default TextField;
