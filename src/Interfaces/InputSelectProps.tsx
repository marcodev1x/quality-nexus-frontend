export interface InputSelectProps extends React.ComponentProps<"select"> {
  label: string;
  options: string[] | { option: string; explanation: string }[];
  changeState: (value: string) => void;
}
