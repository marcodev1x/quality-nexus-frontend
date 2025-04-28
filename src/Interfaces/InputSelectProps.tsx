export interface InputSelectProps extends React.ComponentProps<"select"> {
  label: string;
  options: any[] | { option: string; explanation: string }[];
  changeState: (value: string) => void;
}
