"use client";

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import { Icon } from "@/components/ui/icon";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  className?: string;
  id?: string;
};

/** Только цифры. */
export function phoneDigitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Нормализация к российскому номеру: максимум 11 цифр, начинается с 7.
 * 8XXXXXXXXXX → 7XXXXXXXXXX
 */
export function normalizeRuPhoneDigits(raw: string) {
  let digits = phoneDigitsOnly(raw);

  if (!digits) return "";

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  } else if (digits.startsWith("9") && digits.length <= 10) {
    digits = `7${digits}`;
  } else if (!digits.startsWith("7")) {
    digits = `7${digits}`;
  }

  return digits.slice(0, 11);
}

/** Локальная часть без кода страны (до 10 цифр). */
export function localRuPhoneDigits(value: string) {
  const normalized = normalizeRuPhoneDigits(value);
  return normalized.startsWith("7") ? normalized.slice(1) : normalized;
}

/** Маска: (999) 000-00-00 */
export function formatLocalRuPhone(localDigits: string) {
  const d = phoneDigitsOnly(localDigits).slice(0, 10);
  const parts: string[] = [];

  if (d.length === 0) return "";

  parts.push("(");
  parts.push(d.slice(0, 3));
  if (d.length >= 3) parts.push(") ");
  if (d.length > 3) parts.push(d.slice(3, 6));
  if (d.length >= 6) parts.push("-");
  if (d.length > 6) parts.push(d.slice(6, 8));
  if (d.length >= 8) parts.push("-");
  if (d.length > 8) parts.push(d.slice(8, 10));

  return parts.join("");
}

export function formatFullRuPhone(value: string) {
  const local = localRuPhoneDigits(value);
  if (!local) return "";
  return `+7 ${formatLocalRuPhone(local)}`;
}

export function isCompleteRuPhone(value: string) {
  return normalizeRuPhoneDigits(value).length === 11;
}

export function toE164RuPhone(value: string) {
  const digits = normalizeRuPhoneDigits(value);
  return digits.length === 11 ? `+${digits}` : "";
}

function PhoneInput({
  value,
  onChange,
  name = "phone",
  required,
  className,
  id,
}: PhoneInputProps) {
  const labels = UI_CONFIG.base.phoneInput;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const localDigits = localRuPhoneDigits(value);
  const displayValue = formatLocalRuPhone(localDigits);
  const complete = isCompleteRuPhone(value);
  const showError = touched && !focused && localDigits.length > 0 && !complete;
  const showEmptyError = touched && !focused && localDigits.length === 0 && required;
  const invalid = showError || showEmptyError;

  function commitDigits(rawDigits: string) {
    const normalized = normalizeRuPhoneDigits(rawDigits);
    onChange(normalized ? `+${normalized}` : "");
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    // Если пользователь стёр всё в видимой части — очищаем целиком.
    if (!next.trim()) {
      onChange("");
      return;
    }
    commitDigits(`7${phoneDigitsOnly(next)}`);
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text");
    commitDigits(pasted);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Backspace") return;
    if (displayValue.length > 0) return;
    // Уже пусто — ничего
    if (!localDigits) return;
  }

  function handleFocus() {
    setFocused(true);
  }

  function handleBlur(_event: FocusEvent<HTMLInputElement>) {
    setFocused(false);
    setTouched(true);
  }

  function handleWrapperClick() {
    inputRef.current?.focus();
  }

  const statusMessage = showEmptyError
    ? labels.incomplete
    : showError
      ? labels.incomplete
      : complete && (focused || touched)
        ? labels.complete
        : null;

  return (
    <div className={cn("relative", className)}>
      <input
        type="hidden"
        name={name}
        value={toE164RuPhone(value)}
        required={required}
      />

      <div
        role="presentation"
        onClick={handleWrapperClick}
        className={cn(
          "group flex w-full cursor-text items-center gap-2.5 rounded-xl border bg-gradient-to-b from-white/90 to-[#FAF7F2] px-3 py-2.5 shadow-[var(--shadow-input)] transition-[border-color,box-shadow,background-color] duration-300",
          "border-black/[0.06]",
          focused &&
            "border-[#BC5434]/35 bg-white shadow-[var(--shadow-input-focus)]",
          invalid &&
            "border-[#C45C3E]/45 bg-[#FFF8F6] shadow-[0_0_0_3px_rgba(196,92,62,0.08)]",
          complete &&
            !focused &&
            touched &&
            "border-[#5c6b3a]/30 bg-[#F7FAF4]"
        )}
      >
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-lg border px-2.5 py-1.5 font-sans text-[13px] font-semibold tracking-wide transition-colors duration-300",
            focused
              ? "border-[#BC5434]/25 bg-[#FCEEE8] text-[#BC5434]"
              : complete && touched
                ? "border-[#5c6b3a]/25 bg-[#E8ECDF] text-[#3D4F40]"
                : "border-[#E8E0D4] bg-white/80 text-[#3A3A34]"
          )}
          aria-hidden
        >
          {labels.countryCode}
        </span>

        <input
          ref={inputRef}
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={labels.placeholder}
          aria-label={labels.ariaLabel}
          aria-invalid={invalid || undefined}
          aria-describedby={statusMessage ? `${inputId}-status` : undefined}
          value={displayValue}
          onChange={handleChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "min-w-0 flex-1 bg-transparent py-0.5 font-sans text-sm tracking-wide text-[#1A241C]",
            "placeholder:text-[#9A9288]",
            "outline-none ring-0 focus:outline-none focus:ring-0"
          )}
        />

        <span className="flex size-8 shrink-0 items-center justify-center">
          {complete ? (
            <span className="flex size-6 items-center justify-center rounded-full bg-[#E8ECDF] text-[#3D4F40]">
              <Icon name="check" size={14} />
            </span>
          ) : (
            <Icon
              name="phone"
              size={17}
              className={cn(
                "transition-colors duration-300",
                focused ? "text-[#BC5434]" : "text-[#A89F94]",
                invalid && "text-[#C45C3E]"
              )}
            />
          )}
        </span>
      </div>

      {statusMessage ? (
        <p
          id={`${inputId}-status`}
          className={cn(
            "mt-1.5 px-1 font-sans text-[11px] tracking-wide",
            complete && !invalid ? "text-[#5c6b3a]" : "text-[#C45C3E]"
          )}
        >
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}

export { PhoneInput };
