import { EditorialBand } from "@/components/home/editorial-band";
import { ExpeditionSection } from "@/components/home/expedition-section";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";

export function WhySiestaSection() {
  const { manifest } = GLOBAL_CONFIG;

  return (
    <EditorialBand
      id="about"
      text={
        <div className="max-w-xl lg:max-w-none">
          <Typography
            variant="h2"
            className="mb-5 font-serif text-3xl font-normal leading-[1.15] tracking-wide text-[#1A241C] md:text-4xl lg:text-[2.75rem]"
          >
            {manifest.title}
          </Typography>

          <Typography
            variant="body"
            className="mb-4 text-base font-medium leading-[1.7] text-[#2A2A24] md:text-lg"
          >
            {manifest.subtitle}
          </Typography>

          <Typography
            variant="body"
            className="mb-6 text-sm leading-[1.7] text-[#555] md:text-[15px]"
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
                  className="text-sm leading-[1.7] text-[#1A241C]"
                >
                  {feature}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      }
      visual={<ExpeditionSection />}
    />
  );
}
