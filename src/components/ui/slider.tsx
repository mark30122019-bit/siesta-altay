"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  className?: string;
}

function Slider({
  min = 0,
  max = 100000,
  step = 1000,
  value,
  defaultValue = [0, 100000],
  onValueChange,
  className,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      min={min}
      max={max}
      step={step}
      value={value}
      defaultValue={value ? undefined : defaultValue}
      onValueChange={(next) =>
        onValueChange?.(next as [number, number])
      }
      className={cn(
        "relative flex h-5 w-full touch-none select-none items-center",
        className
      )}
    >
      <SliderPrimitive.Track className="relative h-[4px] w-full grow overflow-hidden rounded-full bg-stone-200">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-[#BC5434]" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-4 w-4 rounded-full bg-[#BC5434]",
          "transition-shadow duration-200",
          "hover:shadow-[0_0_0_4px_rgba(188,84,52,0.2)]",
          "focus:outline-none focus:shadow-[0_0_0_4px_rgba(188,84,52,0.25)]"
        )}
      />
      <SliderPrimitive.Thumb
        className={cn(
          "block h-4 w-4 rounded-full bg-[#BC5434]",
          "transition-shadow duration-200",
          "hover:shadow-[0_0_0_4px_rgba(188,84,52,0.2)]",
          "focus:outline-none focus:shadow-[0_0_0_4px_rgba(188,84,52,0.25)]"
        )}
      />
    </SliderPrimitive.Root>
  );
}

export { Slider };
