import { LuLoaderCircle } from "react-icons/lu";
import { Controller } from "react-hook-form";
import classNames from "classnames";
import { PriceInput } from "@/components/PriceInput";
import { TokensModal } from "@/components/TokensModal";
import { ValidationError } from "@/components/ValidationError";
import { useSwapCurrency } from "./useSwapCurrency";
import { SwitchBtn } from "@/components/SwitchBtn";

export function SwapCurrency() {
  const {
    form,
    onSubmit,
    selectMode,
    setSelectMode,
    send,
    receive,
    sendAmountRules,
    receiveAmountRules,
    onAmountChange,
    setToken,
    swap,
    onSwitch,
    renderSendReceive
  } = useSwapCurrency();
  return (
    <>
      <main className="bg-linear-[139.73deg,#E5FDFF,#F3EFFF]">
        <section className="container mx-auto min-h-screen flex items-center justify-center">
          <form
            className="w-2/3 bg-white rounded-4xl border border-gray-200 p-8 shadow-lg flex flex-col gap-6 max-w-xl"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h5 className="font-semibold">Swap Currency</h5>
            <div className="flex flex-col gap-4">
              <label htmlFor="input-amount" className="font-medium">
                Amount to send
              </label>
              <div className="relative w-full">
                <Controller
                  name="sendAmount"
                  control={form.control}
                  rules={sendAmountRules}
                  render={({ field }) => (
                    <PriceInput
                      id="input-amount"
                      disabled={!send}
                      {...field}
                      value={field.value ?? ""}
                      onChange={onAmountChange(
                        field,
                        "sendAmount",
                        "receiveAmount"
                      )}
                    />
                  )}
                />
                <Controller
                  name="send"
                  control={form.control}
                  rules={{
                    required: "Send token is required",
                  }}
                  render={renderSendReceive}
                />
              </div>
              <ValidationError
                hidden={!form.formState.errors.sendAmount}
                message={form.formState.errors.sendAmount?.message ?? ""}
              />
              <ValidationError
                hidden={!form.formState.errors.send}
                message={form.formState.errors.send?.message ?? ""}
              />
              <SwitchBtn onSwitch={onSwitch} />
              <label htmlFor="output-amount" className="font-medium">
                Amount to receive
              </label>
              <div className="relative w-full">
                <Controller
                  name="receiveAmount"
                  control={form.control}
                  rules={receiveAmountRules}
                  render={({ field }) => (
                    <PriceInput
                      id="output-amount"
                      disabled={!receive}
                      {...field}
                      value={field.value ?? ""}
                      onChange={onAmountChange(
                        field,
                        "receiveAmount",
                        "sendAmount"
                      )}
                    />
                  )}
                />

                <Controller
                  name="receive"
                  control={form.control}
                  rules={{
                    required: "Receive token is required",
                  }}
                  render={renderSendReceive}
                />
              </div>
              <ValidationError
                hidden={!form.formState.errors.receiveAmount}
                message={form.formState.errors.receiveAmount?.message ?? ""}
              />
              <ValidationError
                hidden={!form.formState.errors.receive}
                message={form.formState.errors.receive?.message ?? ""}
              />
            </div>
            <button
              className="w-full bg-cyan-400 rounded-xl p-3 text-white font-semibold hover:opacity-70 disabled:opacity-50 flex justify-center items-center gap-4"
              type="submit"
              disabled={swap.isPending}
            >
              <div className="relative">
                CONFIRM SWAP
                <LuLoaderCircle
                  className={classNames(
                    "text-white animate-spin absolute -right-8 top-1/2 -translate-y-1/2",
                    {
                      hidden: !swap.isPending,
                    }
                  )}
                />
              </div>
            </button>
          </form>
        </section>
        <TokensModal
          title="Tokens"
          onClick={setToken(selectMode!)}
          onClose={() => setSelectMode(undefined)}
          exclude={selectMode === "send" ? receive : send}
          isOpen={!!selectMode}
        />
      </main>
    </>
  );
}
