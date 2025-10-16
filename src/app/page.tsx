"use client";
import { BenefitsSection } from "@/components/home/BenifitSection";
import { CompetitionFlow } from "@/components/home/CompetitionFlow";
import { Hero } from "@/components/home/Hero";
import { Roadmap } from "@/components/home/RoadMap";
import { UpcomingFeatures } from "@/components/home/UpcomingFeatures";
import { WaitlistSection } from "@/components/home/WaitlistSection";
import { useFetchHomeDataQuery } from "@/store/api/homeApi";
import type { Metadata } from "next";

export default function HomePage() {
  const { data: homeData, isLoading, error } = useFetchHomeDataQuery();

  return (
    <div className="">
      <Hero homeData={homeData} />
      <BenefitsSection />
      <CompetitionFlow homeData={homeData} />
      <Roadmap />
      <UpcomingFeatures />
      <WaitlistSection />
    </div>
  );
}
