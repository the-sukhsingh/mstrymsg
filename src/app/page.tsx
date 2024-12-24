"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
export default function Home() {

  const dummyData = [
    {
      title: "Anonymous Feedback",
      description: "Get anonymous feedback from your friends, family and colleagues.",
    },
    {
      title: "Share your Thoughts",
      description: "Share your thoughts and get feedback from your friends.",
    },
    {
      title: "Stay Anonymous",
      description: "Stay anonymous and share your thoughts without any fear.",
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-screen bg-gray-800 p-4">
      <div className="w-full text-center">

      <h1 className="text-3xl text-center md:text-5xl font-extrabold text-white mb-4">
        Dive into the World of Anonymous Feedback
      </h1>
      <p className="text-gray-200/80">Mystry Message - Where you identify remains a mystery.</p>
        </div>
      <div className="w-full max-w-md mt-10">
        <Carousel
          className="relative w-full overflow-hidden rounded-lg"
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: true,
            }),
          ]}
        >
          <CarouselContent >
            {dummyData.map((data, index) => {
              return (
                <CarouselItem key={index}>
                  <div className="p-4 my-auto bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold">{data.title}</h1>
                    <p>{data.description}</p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

        <Link href={"/sign-up"}>
        <Button className="mt-4" variant={"outline"}>Get Started</Button>
        </Link>

    </div>
  );
}
