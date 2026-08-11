import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";

export function WhySiestaSection() {
  const { manifest } = GLOBAL_CONFIG;

  return (
    <div className="max-w-xl lg:max-w-none">

      <Typography
        variant="h2"
        className="mb-4 text-2xl font-bold uppercase tracking-[0.04em] text-[#1A241C] md:text-3xl"
      >
        {manifest.title}
      </Typography>

      <Typography
        variant="body"
        className="mb-4 text-base font-medium text-[#2A2A24] md:text-lg"
      >
        {manifest.subtitle}
      </Typography>

      <Typography
        variant="body"
        className="mb-4 text-sm leading-relaxed text-[#555] md:text-[15px]"
      >
        {manifest.description}
      </Typography>

      <ul className="space-y-2">
        {manifest.features.map((feature) => (
          <li key={feature} className="flex items-start">
            <Icon
              name="chevron"
              size={28}
              className="shrink-0 text-stone-400"
            />
            <Typography
              variant="body"
              className="text-sm text-[#1A241C] md:text-sm"
            >
              {feature}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}
