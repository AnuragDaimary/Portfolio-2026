import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { About } from "@/components/home/About";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <SelectedWork />
        <Experience />
      </main>
      <Footer />
    </>
  );
}
