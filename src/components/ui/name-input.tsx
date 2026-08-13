"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type AnimationEvent,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";

import { Icon } from "@/components/ui/icon";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

const NAME_MAX_LENGTH = 40;
const NAME_MIN_LENGTH = 2;

type NameInputProps = {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  className?: string;
  id?: string;
};

export function isValidBookingName(value: string) {
  const trimmed = value.trim();
  return (
    trimmed.length >= NAME_MIN_LENGTH &&
    trimmed.length <= NAME_MAX_LENGTH &&
    /^[\p{L}\s'’.-]+$/u.test(trimmed)
  );
}

function NameInput({
  value,
  onChange,
  name = "name",
  required,
  className,
  id,
}: NameInputProps) {
  const labels = UI_CONFIG.base.nameInput;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const complete = isValidBookingName(value);
  const showError =
    touched && !focused && value.trim().length > 0 && !complete;
  const showEmptyError =
    touched && !focused && value.trim().length === 0 && Boolean(required);
  const invalid = showError || showEmptyError;

  function syncFromDom(raw: string) {
    const next = raw.slice(0, NAME_MAX_LENGTH);
    if (next !== value) onChange(next);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    syncFromDom(event.target.value);
  }

  function handleInput(event: FormEvent<HTMLInputElement>) {
    syncFromDom((event.target as HTMLInputElement).value);
  }

  function handleBlur(_event: FocusEvent<HTMLInputElement>) {
    setFocused(false);
    setTouched(true);
    const trimmed = (inputRef.current?.value ?? value).trim();
    if (trimmed !== value) onChange(trimmed);
    else onChange(value.trim());
  }

  /** Chrome/Safari autofill часто не шлёт onChange — ловим через animation + polling. */
  function handleAnimationStart(event: AnimationEvent<HTMLInputElement>) {
    if (
      event.animationName === "onAutoFillStart" ||
      event.animationName.includes("onAutoFill")
    ) {
      syncFromDom(event.currentTarget.value);
      setTouched(true);
    }
  }

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const sync = () => {
      if (input.value && input.value !== value) {
        syncFromDom(input.value);
        setTouched(true);
      }
    };

    // Autofill может появиться с задержкой после монтирования / фокуса
    const t1 = window.setTimeout(sync, 100);
    const t2 = window.setTimeout(sync, 500);
    const t3 = window.setTimeout(sync, 1000);

    input.addEventListener("input", sync);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      input.removeEventListener("input", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync only on mount / value identity via closure refresh
  }, [value, onChange]);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "field-surface relative flex w-full items-center rounded-xl border bg-gradient-to-b from-white/90 to-[#FAF7F2] shadow-[var(--shadow-input)] transition-[border-color,box-shadow,background-color] duration-300",
          "border-black/[0.06]",
          focused &&
            !complete &&
            !invalid &&
            "border-[#BC5434]/35 bg-white shadow-[var(--shadow-input-focus)]",
          invalid &&
            "border-[#C45C3E]/45 bg-[#FFF8F6] shadow-[0_0_0_3px_rgba(196,92,62,0.08)]",
          complete &&
            !invalid &&
            "is-valid border-[#5c6b3a]/35 bg-[#F4F7F0]"
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          name={name}
          autoComplete="name"
          autoCapitalize="words"
          spellCheck={false}
          maxLength={NAME_MAX_LENGTH}
          placeholder={labels.placeholder}
          aria-label={labels.ariaLabel}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${inputId}-status` : undefined}
          value={value}
          required={required}
          onChange={handleChange}
          onInput={handleInput}
          onAnimationStart={handleAnimationStart}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          className={cn(
            "field-autofill w-full rounded-xl bg-transparent px-4 py-3 pr-11 font-sans text-sm text-[#1A241C]",
            "placeholder:text-[#9A9288]",
            "outline-none ring-0 focus:outline-none focus:ring-0"
          )}
        />

        <span className="pointer-events-none absolute right-3 flex size-8 items-center justify-center">
          {complete ? (
            <span className="flex size-6 items-center justify-center rounded-full bg-[#E8ECDF] text-[#3D4F40]">
              <Icon name="check" size={14} />
            </span>
          ) : null}
        </span>
      </div>

      {invalid ? (
        <p
          id={`${inputId}-status`}
          className="mt-1.5 px-1 font-sans text-[11px] tracking-wide text-[#C45C3E]"
        >
          {showEmptyError ? labels.incomplete : labels.invalid}
        </p>
      ) : null}
    </div>
  );
}

export { NameInput, NAME_MAX_LENGTH };
