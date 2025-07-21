type PriceInputProps = {
  id: string;
  disabled?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;
export const PriceInput = ({ id, disabled, ...rest }: PriceInputProps) => {
  return (
    <input
      id={id}
      className="w-full bg-violet-50 border border-violet-300 focus-visible:border-violet-500 shadow-sm rounded-xl p-3 text-right font-bold pl-36"
      disabled={disabled}
      placeholder="0.00"
      autoComplete="off"
      {...rest}
    />
  );
};
