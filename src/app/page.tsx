import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Engineering } from "@/components/sections/engineering";
import { Hero } from "@/components/sections/hero";
import { SelectedProjects } from "@/components/sections/selected-projects";

/**
 * One-page portfolio.
 *
 * Deliberately short. The deep material — the interactive system view, the
 * "why these technologies" answers, the build process, and the security,
 * performance and testing detail — lives on /engineering, linked from the
 * Engineering section's CTA. What stays here is what a visitor skims in under a
 * minute: who this is, what was built, the areas worked in, and how to make
 * contact.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedProjects />
      <Engineering />
      <About />
      <Contact />
    </>
  );
}
