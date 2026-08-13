import type { Metadata } from "next";

import { AlertBox } from "@/components/ui/alert-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "UI kit",
  robots: { index: false, follow: false },
};

export default function TestUiPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] px-4 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-start space-y-4">
          <Button variant="outline">Забронировать</Button>
          <Button variant="fill">Отправить в ООО «Сиеста Центр»</Button>
          <Button variant="ghost">360° Зайти внутрь</Button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-sm">
          <Chip label="с детьми" isActive={true} />
          <Chip label="вдвоём" isActive={false} />
          <Chip label="компанией" isActive={false} />
          <Chip label="корпоратив" isActive={false} />
        </div>

        <div className="mt-8 max-w-2xl">
          <AlertBox variant="danger" title="КОМУ НЕ ПОДОЙДЕТ">
            КОММЕНТАРИЙ О ДЕТЯХ: Критически важно — отдых с детьми здесь может
            быть затруднен из-за время ограничения многих, крутой местность,
            авиации, олимпиадных нормативов, ваших детьми сберегающие правила,
            тихо комьюнити, из неудобств позиционирования инфраструктуры,
            неискушающих ребенок.
          </AlertBox>
        </div>

        <Card className="mt-8 max-w-sm p-6">
          <div className="flex h-48 w-full items-center justify-center rounded-lg bg-stone-200 text-sm text-stone-400">
            [ Место для фото базы ]
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-5 w-2/3 rounded bg-stone-200" />
            <div className="h-4 w-1/3 rounded bg-stone-100" />
            <div className="mt-4 h-6 w-1/2 rounded bg-stone-200" />
          </div>
        </Card>

        <div className="mt-8 max-w-xl rounded-xl border border-stone-200 bg-[#FBFBFA] p-6">
          <Typography variant="h2" className="mb-4 text-center">
            Оставить заявку
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <Input type="text" placeholder="Имя" required />
            <Input type="tel" placeholder="Телефон" required />
          </div>
          <div className="mt-4">
            <Input type="text" placeholder="Даты" required className="w-full" />
          </div>
        </div>

        <Card className="mt-8 max-w-xs border border-stone-100 bg-white p-6 shadow-sm">
          <Typography
            variant="caption"
            className="mb-2 block font-medium text-stone-700"
          >
            Цена
          </Typography>
          <div className="mb-4 flex gap-4">
            <div className="text-xs text-stone-500">
              от{" "}
              <span className="font-semibold text-stone-800">12 000 ₽</span>
            </div>
            <div className="text-xs text-stone-500">
              до{" "}
              <span className="font-semibold text-stone-800">50 000 ₽</span>
            </div>
          </div>
          <Slider
            min={0}
            max={100000}
            step={1000}
            defaultValue={[12000, 50000]}
          />
        </Card>

        <div className="mt-8 max-w-xs rounded-xl border border-stone-100 bg-white p-6 shadow-sm">
          <Typography
            variant="caption"
            className="mb-3 block font-medium text-stone-700"
          >
            Бейджи на элементах:
          </Typography>
          <div className="relative h-40 w-full overflow-hidden rounded-lg bg-stone-300">
            <div className="absolute inset-0 flex items-center justify-center text-xs text-stone-500">
              [ Превью фото ]
            </div>
            <Badge
              variant="tour"
              text="3D-тур"
              className="absolute bottom-3 right-3"
            />
          </div>
          <div className="relative mt-4 flex h-16 w-full items-center justify-center overflow-hidden rounded-lg bg-stone-200">
            <div className="text-xs text-stone-600">Миниатюра галереи</div>
            <Badge variant="count" text="ещё 3" />
          </div>
        </div>
      </div>
    </main>
  );
}
