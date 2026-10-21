import Link from "next/link";
import { Bot } from "lucide-react";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/Card";
import { svaratiAiContent as ai } from "@/content/labels";

export default function SvaratiAiBanner() {
  return (
    <section id="svarati-ai" className="px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <Card
          variant="lavender"
          className="flex flex-col gap-5 rounded-3xl px-6 py-6 md:flex-row md:items-center md:justify-between md:gap-8 lg:px-8"
        >
          <div className="max-w-3xl">
            <Badge variant="lavender" styleType="white" className="mb-3 gap-1.5 shadow-sm">
              <Bot className="size-3.5" aria-hidden="true" />
              {ai.badge}
            </Badge>

            <CardTitle className="mb-1.5 text-xl text-svarati-teal md:text-2xl">
              {ai.judul}
            </CardTitle>

            <CardDescription className="text-sm text-svarati-lavender-dark/80">
              {ai.deskripsi}
            </CardDescription>
          </div>

          <Button
            render={<Link href={ai.cta.href} />}
            nativeButton={false}
            variant="secondary"
            size="lg"
            className="shrink-0 self-start rounded-full px-6 font-bold md:self-center"
          >
            {ai.cta.label}
          </Button>
        </Card>
      </div>
    </section>
  );
}