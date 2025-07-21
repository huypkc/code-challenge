import { LuChevronDown, LuLoaderCircle } from "react-icons/lu";
import type { ControllerRenderProps } from "react-hook-form";
import type { FormValues, InputType } from "@/models/models";
import { getTokenLogoUrl } from "@/utils/utils";
import { memo } from "react";

export const TokenSelect = memo(({
  field,
  setSelectMode,
  isLoading,
  mode,
}: {
  field: ControllerRenderProps<FormValues, InputType>;
  setSelectMode: (mode: InputType) => void;
  isLoading: boolean;
  mode: InputType;
}) => (
  <button
    className="absolute top-1/2 left-3 -translate-y-1/2 hover:bg-white px-3 py-2 rounded-xl font-bold"
    onClick={() => setSelectMode(mode)}
    type="button"
  >
    {field.value ? (
      <div className="flex gap-2 items-center">
        <img
          src={getTokenLogoUrl(field.value.currency)}
          className="h-6 w-6 rounded-full"
          onError={(e) => e.currentTarget.src= "/token.png"}
        />
        <span>{field.value.currency}</span>
        <LuChevronDown className="text-violet-500"></LuChevronDown>
      </div>
    ) : isLoading ? (
      <LuLoaderCircle className="text-violet-500 animate-spin" />
    ) : (
      <div>Select Token</div>
    )}
  </button>
));
