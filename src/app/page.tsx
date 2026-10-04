import { Footer } from "@/components/Footer";
import { About } from "@/components/home/About";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";

export default function HomePage() {
  return (
    <>
      <main id="main">
        <Hero />
        <SelectedWork />
        <About />
        <Experience />
      </main>
      <Footer />
    </>
  );
}
