import { SiteHeaderClient } from "@/components/site-header-client";
import { allTools, toolSections } from "@/lib/tool-catalog";

export function SiteHeader() {
  return <SiteHeaderClient tools={allTools} sections={toolSections} />;
}
