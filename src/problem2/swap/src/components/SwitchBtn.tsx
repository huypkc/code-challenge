import { memo } from "react";
import { LuArrowDownUp } from "react-icons/lu";

export const SwitchBtn = memo(({ onSwitch }: { onSwitch: () => void }) => (
  <div className="relative w-full text-center">
    <button
      className="p-3 hover:opacity-70 bg-white font-semibold rounded-xl border border-gray-200 relative z-10 group"
      type="button"
      onClick={onSwitch}
    >
      <LuArrowDownUp className="text-cyan-400 group-hover:rotate-180 transition-transform duration-300" />
    </button>
    <hr className="w-full absolute top-1/2 z-0 border-gray-200" />
  </div>
));
