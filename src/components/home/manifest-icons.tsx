/** Декор блока «Почему Сиеста» — editorial line-art под макет, SSR */
export function ManifestIcons({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
    >
      {/* Горы — широкий силуэт из двух пиков */}
      <svg
        viewBox="0 0 72 40"
        fill="none"
        className="h-9 w-[4.5rem] shrink-0 text-[#3A3A34] md:h-10 md:w-20"
      >
        <path
          d="M2 36 22 8l10 14 8-12 20 26"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 8 28.5 18.5"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          d="M40 10 46 20"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      {/* Кедр — «леденец»: овал кроны + ствол */}
      <svg
        viewBox="0 0 36 48"
        fill="none"
        className="h-11 w-8 shrink-0 text-[#3A3A34] md:h-12 md:w-9"
      >
        <ellipse
          cx="18"
          cy="16"
          rx="13"
          ry="14"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path
          d="M18 30v14"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M14 44h8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>

      {/* Карта в квадратной рамке — как на макете */}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        className="h-9 w-9 shrink-0 text-[#3A3A34] md:h-10 md:w-10"
      >
        <rect
          x="5"
          y="5"
          width="34"
          height="34"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M12 28c3-7 6.5-11 10-11s5 2 7 5 3.5 7 5 9"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 18.5c1.2-1.8 2.8-2.8 4.5-2.8"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
