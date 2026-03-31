import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PeptideFind privacy policy and data handling practices.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-bold">Privacy Policy</h1>
      <p className="mb-6 text-sm text-muted-foreground">Last updated: March 2026</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide directly, including your name, email
            address, and any reviews or feedback you submit. We also collect usage
            data such as search queries, pages visited, and click-through data for
            analytics purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use your information to provide and improve our services, send price
            alerts and notifications you&apos;ve opted into, and aggregate anonymous
            analytics to improve the platform experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">3. Data Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell your personal information. We may share anonymous,
            aggregated data with vendors to help them improve their services. Click
            data is shared with vendors in aggregate form only.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">4. Cookies</h2>
          <p className="text-muted-foreground">
            We use essential cookies for authentication and session management. We
            also use analytics cookies to understand how our platform is used. You
            can manage cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">5. Contact</h2>
          <p className="text-muted-foreground">
            For questions about this privacy policy, please contact us at{" "}
            <a href="mailto:privacy@peptidefind.com" className="text-accent hover:underline">
              privacy@peptidefind.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
