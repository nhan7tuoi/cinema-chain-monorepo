import { PageBody, PageSection } from "@/components/common/layout/page-shell";
import { ResponsiveText } from "@/components/common/typography";

export default function PromotionsPage() {
  return (
    <PageBody>
      <PageSection className="pt-28 sm:pt-32">
        <ResponsiveText as="h1" variant="sectionTitle">
          Promotions Page
        </ResponsiveText>
      </PageSection>
    </PageBody>
  );
}
