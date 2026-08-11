import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";

const featureIcons = ["mountains", "tree", "map"] as const;

export function WhySiestaSection() {
  const { manifest, promoTour } = GLOBAL_CONFIG;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-4 flex items-center gap-3 text-[#4A5D4E]">
          {featureIcons.map((name) => (
            <Icon key={name} name={name} size={22} />
          ))}
        </div>

        <Typography variant="h2" className="mb-4 uppercase tracking-wide">
          {manifest.title}
        </Typography>

        <Typography variant="body" className="mb-3 max-w-md">
          {manifest.subtitle}
        </Typography>
        <Typography variant="body" className="mb-5 max-w-md text-[#555]">
          {manifest.description}
        </Typography>

        <ul className="space-y-2">
          {manifest.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 font-sans text-sm text-[#1A241C]"
            >
              <Icon name="chevron" size={16} className="text-stone-400" />
              <Typography variant="body" className="text-sm md:text-sm">
                {feature}
              </Typography>
            </li>
          ))}
        </ul>
      </div>

      <Card className="relative overflow-hidden border-0 bg-transparent p-0 shadow-none">
        <div
          className="absolute inset-0 bg-[linear-gradient(135deg,#1a241c_0%,#3b4a3e_45%,#5c4030_100%)]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
        <div className="relative flex min-h-[200px] flex-col justify-end p-6 pr-28 md:min-h-[220px] md:p-8 md:pr-36">
          <Typography variant="h3" className="mb-2 text-white md:text-2xl">
            {promoTour.title}
          </Typography>
          <Typography variant="body" className="max-w-sm text-white/85">
            {promoTour.description}
          </Typography>
          <Badge
            variant="action"
            text={promoTour.badge}
            className="absolute right-4 top-1/2 h-24 w-24 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 px-3 text-center text-[11px] font-medium leading-tight tracking-wide backdrop-blur-[2px] md:right-6 md:h-28 md:w-28 md:text-xs"
          />
        </div>
      </Card>
    </div>
  );
}
