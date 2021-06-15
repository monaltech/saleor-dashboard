import { ExitFormPromptContext } from "@saleor/components/Form/ExitFormPromptProvider";
import { getMutationErrors, SaleorMutationResult } from "@saleor/misc";
import { toggle } from "@saleor/utils/lists";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { MutationFetchResult } from "react-apollo";

import useStateFromProps from "./useStateFromProps";

export interface ChangeEvent<TData = any> {
  target: {
    name: string;
    value: TData;
  };
}
export type SubmitPromise<
  TMutationResult extends Record<keyof TMutationResult, SaleorMutationResult>
> = Promise<MutationFetchResult<TMutationResult>>;

// Promise<Record<string, SaleorMutationResult>>;
// export type SubmitPromise = Promise<Record<string, SaleorMutationResult>>;

export type FormChange = (event: ChangeEvent, cb?: () => void) => void;

export type FormErrors<T> = {
  [field in keyof T]?: string | React.ReactNode;
};

export interface UseFormResult<T> {
  change: FormChange;
  data: T;
  hasChanged: boolean;
  reset: () => void;
  set: (data: Partial<T>) => void;
  submit: () => void;
  triggerChange: () => void;
  toggleValue: FormChange;
  errors: FormErrors<T>;
  setError: (name: keyof T, error: string | React.ReactNode) => void;
  clearErrors: (name?: keyof T | Array<keyof T>) => void;
  confirmLeave?: boolean;
}

type FormData = Record<string, any | any[]>;

function merge<T extends FormData>(prevData: T, prevState: T, data: T): T {
  return Object.keys(prevState).reduce(
    (acc, key) => {
      if (!isEqual(data[key], prevData[key])) {
        acc[key as keyof T] = data[key];
      }

      return acc;
    },
    { ...prevState }
  );
}

function handleRefresh<T extends FormData>(
  data: T,
  newData: T,
  setChanged: (status: boolean) => void
) {
  if (isEqual(data, newData)) {
    setChanged(false);
  }
}

function useForm<TData extends FormData, TMutation>(
  initial: TData,
  onSubmit?: (data: TData) => SubmitPromise<TMutation> | void,
  confirmLeave = false
): UseFormResult<TData> {
  const [hasChanged, setChanged] = useState(false);
  const [errors, setErrors] = useState<FormErrors<TData>>({});
  const [data, setData] = useStateFromProps(initial, {
    mergeFunc: merge,
    onRefresh: newData => handleRefresh(data, newData, handleSetChanged)
  });

  const handleSetChanged = (value: boolean) => {
    setChanged(value);

    if (confirmLeave) {
      setIsDirty(value);
    }
  };

  const { setIsDirty, submitRef } = useContext(ExitFormPromptContext);

  const handleSetPromptSubmit = () => {
    submitRef.current = submit;
    return () => (submitRef.current = null);
  };

  useEffect(handleSetPromptSubmit, [onSubmit]);

  function toggleValue(event: ChangeEvent, cb?: () => void) {
    const { name, value } = event.target;
    const field = data[name as keyof TData];

    if (Array.isArray(field)) {
      if (!hasChanged) {
        handleSetChanged(true);
      }

      setData({
        ...data,
        [name]: toggle(value, field, isEqual)
      });
    }

    if (typeof cb === "function") {
      cb();
    }
  }

  function change(event: ChangeEvent) {
    const { name, value } = event.target;

    if (!(name in data)) {
      console.error(`Unknown form field: ${name}`);
      return;
    } else {
      if (data[name] !== value) {
        handleSetChanged(true);
      }
      setData(data => ({
        ...data,
        [name]: value
      }));
    }
  }

  function reset() {
    setData(initial);
  }

  function set(newData: Partial<T>, setHasChanged = true) {
    setData(data => ({
      ...data,
      ...newData
    }));
    handleSetChanged(setHasChanged);
  }

  async function submit() {
    if (typeof onSubmit === "function" && !Object.keys(errors).length) {
      const result = onSubmit(data);

      if (result) {
        const resultData = await result;
        const errors = getMutationErrors(resultData.data);

        if (errors?.length === 0) {
          handleSetChanged(false);
          return { isError: false };
        }

        return { isError: true };
      }
    }
  }

  function triggerChange() {
    handleSetChanged(true);
  }

  const setError = (field: keyof TData, error: string | React.ReactNode) =>
    setErrors(e => ({ ...e, [field]: error }));

  const clearErrors = (field?: keyof TData | Array<keyof TData>) => {
    if (!field) {
      setErrors({});
    } else {
      setErrors(errors =>
        omit<FormErrors<TData>>(errors, Array.isArray(field) ? field : [field])
      );
    }
  };

  return {
    setError,
    errors,
    change,
    clearErrors,
    data,
    hasChanged,
    reset,
    set,
    submit,
    toggleValue,
    triggerChange
  };
}

export default useForm;
