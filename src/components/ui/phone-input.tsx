"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Icon } from "@/components/ui/icon";
import {
  DEFAULT_PHONE_COUNTRY,
  detectCountryFromE164,
  formatByMask,
  isCompletePhone,
  isCompletePhoneValue,
  nationalFromE164,
  normalizeNationalDigits,
  phoneDigitsOnly,
  PHONE_COUNTRIES,
  toE164,
  type PhoneCountry,
} from "@/config/phoneCountries";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

export {
  isCompletePhone,
  isCompletePhoneValue,
  toE164,
  phoneDigitsOnly,
} from "@/config/phoneCountries";

/** @deprecated используйте isCompletePhoneValue */
export function isCompleteRuPhone(value: string) {
  return isCompletePhoneValue(value);
}

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  className?: string;
  id?: string;
};

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
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [country, setCountry] = useState<PhoneCountry>(() =>
    value ? detectCountryFromE164(value) : DEFAULT_PHONE_COUNTRY
  );

  const national = nationalFromE164(value, country);
  const displayValue = formatByMask(national, country.mask);
  const complete = isCompletePhone(value, country);
  const showError =
    touched && !focused && !menuOpen && national.length > 0 && !complete;
  const showEmptyError =
    touched && !focused && !menuOpen && national.length === 0 && Boolean(required);
  const invalid = showError || showEmptyError;

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function commitNational(raw: string, nextCountry = country) {
    const normalized = normalizeNationalDigits(raw, nextCountry);
    onChange(normalized ? toE164(normalized, nextCountry) : "");
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    if (!next.trim()) {
      onChange("");
      return;
    }
    commitNational(next);
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text");
    const digits = phoneDigitsOnly(pasted);

    const matched = [...PHONE_COUNTRIES]
      .sort((a, b) => b.dialCode.length - a.dialCode.length)
      .find((item) => {
        if (!digits.startsWith(item.dialCode)) return false;
        if (item.dialCode === "7" && item.iso === "KZ") return false;
        return true;
      });

    if (matched && matched.iso !== country.iso) {
      setCountry(matched);
      commitNational(digits.slice(matched.dialCode.length), matched);
      return;
    }

    commitNational(pasted);
  }

  function handleCountrySelect(next: PhoneCountry) {
    setCountry(next);
    setMenuOpen(false);
    const kept = national.slice(0, next.maxLength);
    onChange(kept ? toE164(kept, next) : "");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleFocus() {
    setFocused(true);
  }

  function handleBlur(_event: FocusEvent<HTMLInputElement>) {
    setFocused(false);
    setTouched(true);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setMenuOpen((prev) => !prev);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setMenuOpen(true);
    }
  }

  const statusMessage = invalid ? labels.incomplete : null;
  const e164Value = complete ? value : "";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <input type="hidden" name={name} value={e164Value} required={required} />
      <input type="hidden" name={`${name}_country`} value={country.iso} />

      <div
        className={cn(
          "field-surface flex w-full items-center rounded-xl border bg-gradient-to-b from-white/90 to-[#FAF7F2] shadow-[var(--shadow-input)] transition-[border-color,box-shadow,background-color] duration-300",
          "border-black/[0.06]",
          focused &&
            !invalid &&
            "border-[#BC5434]/35 bg-white shadow-[var(--shadow-input-focus)]",
          invalid &&
            "border-[#C45C3E]/45 bg-[#FFF8F6] shadow-[0_0_0_3px_rgba(196,92,62,0.08)]",
          complete &&
            !focused &&
            !invalid &&
            "border-[#5c6b3a]/35 bg-[#F4F7F0]"
        )}
      >
        <button
          type="button"
          aria-label={labels.countryAria}
          aria-expanded={menuOpen}
          aria-haspopup="listbox"
          onClick={() => setMenuOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-l-xl py-3 pl-3.5 pr-2 font-sans text-sm transition-colors",
            "hover:bg-black/[0.03]",
            menuOpen && "bg-black/[0.03]"
          )}
        >
          <span className="text-base leading-none" aria-hidden>
            {country.flag}
          </span>
          <span className="font-semibold tracking-wide text-[#2A2A24]">
            +{country.dialCode}
          </span>
          <Icon
            name="chevronDown"
            size={14}
            className={cn(
              "text-[#8A8278] transition-transform duration-200",
              menuOpen && "rotate-180"
            )}
          />
        </button>

        <span
          className="h-5 w-px shrink-0 bg-[#E0D8CC]"
          aria-hidden
        />

        <input
          ref={inputRef}
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={country.mask.replace(/#/g, "0")}
          aria-label={labels.ariaLabel}
          aria-invalid={invalid || undefined}
          aria-describedby={statusMessage ? `${inputId}-status` : undefined}
          value={displayValue}
          onChange={handleChange}
          onPaste={handlePaste}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "field-autofill min-w-0 flex-1 bg-transparent px-3 py-3 font-sans text-sm tracking-wide text-[#1A241C]",
            "placeholder:text-[#9A9288]",
            "outline-none ring-0 focus:outline-none focus:ring-0"
          )}
        />

        <span className="flex size-8 shrink-0 items-center justify-center pr-2.5">
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

      <AnimatePresence>
        {menuOpen ? (
          <motion.ul
            role="listbox"
            aria-label={labels.countryAria}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-[#E8E0D4] bg-[#FBF8F2] p-1.5 shadow-[0_16px_40px_rgba(42,36,28,0.14)]"
          >
            {PHONE_COUNTRIES.map((item) => {
              const selected = item.iso === country.iso;
              return (
                <li key={item.iso}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleCountrySelect(item)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      selected
                        ? "bg-[#E8ECDF] text-[#1A241C]"
                        : "hover:bg-white/80 text-[#2A2A24]"
                    )}
                  >
                    <span className="text-lg leading-none" aria-hidden>
                      {item.flag}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-sans text-sm">
                      {item.name}
                    </span>
                    <span className="font-sans text-sm font-semibold text-[#6B635A]">
                      +{item.dialCode}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      {statusMessage ? (
        <p
          id={`${inputId}-status`}
          className="mt-1.5 px-1 font-sans text-[11px] tracking-wide text-[#C45C3E]"
        >
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}

export { PhoneInput };
