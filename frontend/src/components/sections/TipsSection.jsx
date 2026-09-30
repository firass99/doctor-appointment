import { Card, CardContent } from "@/components/ui/card";
import Photo from "../Photo";

const tips = [
  {
    img: "/images/tip-1.jpg",
    title: "Preparing for your first visit",
    text: "What to bring and which questions to ask your doctor.",
  },
  {
    img: "/images/tip-2.jpg",
    title: "Choosing the right speciality",
    text: "Not sure who to see? Start with your main symptom.",
  },
  {
    img: "/images/tip-3.jpg",
    title: "Keeping up with check-ups",
    text: "Simple habits that make follow-up visits easier.",
  },
];

export default function TipsSection() {
  return (
    <section id="tips" className="bg-secondary/50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Health tips
          </h2>
          <p className="mt-3 text-muted-foreground">
            Short reads to help you get more from every visit.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((t) => (
            <Card key={t.title} className="overflow-hidden pt-0">
              <Photo src={t.img} alt={t.title} className="h-48 w-full" />
              <CardContent>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
