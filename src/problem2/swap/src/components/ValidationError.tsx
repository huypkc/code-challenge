import classnames from "classnames";
import { memo } from "react";
export const ValidationError = memo(({
  hidden,
  message,
}: {
  hidden: boolean;
  message: string;
}) => {
  console.log("ValidationError rendered");
  return (
    <div
      className={classnames(
        "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg animate-errorAnimation",
        { hidden }
      )}
    >
      {message}
    </div>
  );
})
