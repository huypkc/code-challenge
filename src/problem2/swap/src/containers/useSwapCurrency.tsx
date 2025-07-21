import { useState, useEffect, type ChangeEvent, useCallback } from "react";
import { useForm, type ControllerRenderProps } from "react-hook-form";

import { toast } from "react-toastify";
import axios from "axios";
import { PRICE_REGEX } from "@/constants/constants";
import { useSwap } from "@/hooks/useSwap";
import { useTokens } from "@/hooks/useTokens";
import type {
  InputType,
  FormValues,
  Token,
  InputAmountType,
} from "@/models/models";
import { TokenSelect } from "@/components/TokenSelect";

export const useSwapCurrency = () => {
  const [selectMode, setSelectMode] = useState<InputType | undefined>(
    undefined
  );
  const form = useForm<FormValues>({
    defaultValues: {
      sendAmount: undefined,
      receiveAmount: undefined,
      send: undefined,
      receive: undefined,
    },
  });
  const send = form.watch("send");
  const receive = form.watch("receive");
  const tokens = useTokens();
  useEffect(() => {
    if (tokens.data) {
      form.setValue("send", tokens.data[0]);
      form.setValue("receive", tokens.data[1]);
    }
  }, [form, tokens.data]);
  const getSendReceive = useCallback(() => {
    const _send = form.getValues("send");
    const _receive = form.getValues("receive");
    const sendReceiveRate = _send?.price / _receive?.price;
    return { send: _send, receive: _receive, sendReceiveRate };
  }, [form]);
  const onSwitch = useCallback(() => {
    const { send: _send, receive: _receive } = getSendReceive();
    if (_send && _receive) {
      const receiveAmount = form.getValues("receiveAmount");
      form.setValue("send", form.getValues("receive"));
      form.setValue("receive", _send);
      form.setValue("sendAmount", receiveAmount);
      const { sendReceiveRate: newSendReceiveRate } = getSendReceive();
      if (receiveAmount && newSendReceiveRate) {
        form.setValue("receiveAmount", receiveAmount * newSendReceiveRate);
      } else {
        form.resetField("receiveAmount");
      }
      form.trigger("sendAmount");
      form.trigger("receiveAmount");
    }
  }, [form, getSendReceive]);

  const setToken: (type: InputType) => (item: Token) => void =
    (type: InputType) => (item: Token) => {
      form.setValue(type, item);
      const { sendReceiveRate } = getSendReceive();
      const sendAmount = form.getValues("sendAmount");
      if (sendAmount) {
        form.setValue("receiveAmount", sendAmount * sendReceiveRate);
      } else {
        form.resetField("receiveAmount");
      }
      setSelectMode(undefined);
    };
  const swap = useSwap();
  const onSubmit = async (value: FormValues) => {
    try {
      const { data } = await swap.mutateAsync(value);
      toast.success(
        <div>
          <strong>Swap successful!</strong>
          <br />
          <span>
            <small>
              Sent: {data.sendAmount} {data.send.currency}
            </small>
          </span>
          <br />
          <span>
            <small>
              Received: {data.receiveAmount} {data.receive.currency}
            </small>
          </span>
        </div>
      );
      // Reset form fields after successful swap
      form.resetField("sendAmount");
      form.resetField("receiveAmount");
    } catch (e) {
      toast.error(
        <small>
          {`Swap failed: ${
            axios.isAxiosError(e) ? e.response?.data.message : "Unknown error"
          }`}
        </small>
      );
    }
  };

  const sendAmountRules = {
    required: "Send amount is required",
    max: {
      message: `Send amount exceeds maximum limit (max: ${Number.MAX_SAFE_INTEGER})`,
      value: Number.MAX_SAFE_INTEGER,
    },
    validate: {
      positive: (value: number) => value > 0 || "Send amount must be positive",
      number: (value: number) =>
        !isNaN(value) || "Send amount must be a number",
    },
  };
  const receiveAmountRules = {
    required: form.getValues("sendAmount")
      ? "Receive amount is required"
      : false,
    max: {
      message: `Receive amount exceeds maximum limit (max: ${Number.MAX_SAFE_INTEGER})`,
      value: Number.MAX_SAFE_INTEGER,
    },
    validate: {
      positive: (value: number) =>
        form.getValues("sendAmount")
          ? value > 0 || "Receive amount must be positive"
          : true,
      number: (value: number) =>
        form.getValues("sendAmount")
          ? !isNaN(value) || "Receive amount must be a number"
          : true,
    },
  };

  const onAmountChange =
    (
      field: ControllerRenderProps<FormValues, InputAmountType>,
      source: InputAmountType,
      target: InputAmountType
    ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (inputValue === "") {
        form.resetField(source);
        form.resetField(target);
        return;
      }
      if (!inputValue.match(PRICE_REGEX)) {
        return; // Ignore invalid input
      }
      field.onChange?.(inputValue);
      const match = inputValue.match(PRICE_REGEX);
      if (match) {
        const value = parseFloat(match[0]);
        const {
          send: _send,
          receive: _receive,
          sendReceiveRate,
        } = getSendReceive();
        if (_send && _receive && !isNaN(value)) {
          const rate =
            source === "sendAmount" ? sendReceiveRate : 1 / sendReceiveRate;
          const targetValue = value * rate;
          if (targetValue <= Number.MAX_SAFE_INTEGER) {
            form.setValue(target, targetValue);
            form.clearErrors(source);
            form.clearErrors(target);
          } else {
            form.resetField(target);
            form.setError(target, {
              type: "manual",
              message: `Value exceeds maximum limit (max: ${Number.MAX_SAFE_INTEGER})`,
            });
          }
        } else {
          form.resetField(target);
        }
      } else {
        form.resetField(target);
      }
    };
  const renderSendReceive = ({
    field,
  }: {
    field: ControllerRenderProps<FormValues, InputType>;
  }) => (
    <TokenSelect
      field={field}
      setSelectMode={setSelectMode}
      isLoading={tokens.isLoading}
      mode={field.name as InputType}
    />
  );
  return {
    selectMode,
    setSelectMode,
    form,
    send,
    receive,
    onSwitch,
    onSubmit,
    sendAmountRules,
    receiveAmountRules,
    onAmountChange,
    setToken,
    swap,
    renderSendReceive,
  };
};
