import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "PeptideFind terms of service and usage agreement.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-bold">Terms of Service</h1>
      <p className="mb-6 text-sm text-muted-foreground">Last updated: March 2026</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using PeptideFind, you agree to be bound by these Terms
            of Service. If you do not agree to these terms, please do not use our
            platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">2. Platform Purpose</h2>
          <p className="text-muted-foreground">
            PeptideFind is a comparison platform that aggregates peptide product
            listings from third-party vendors. We do not sell peptides directly. All
            products listed are intended for research purposes only. We are not
            responsible for the quality, accuracy, or legality of products sold by
            third-party vendors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">3. User Accounts</h2>
          <p className="text-muted-foreground">
            You are responsible for maintaining the confidentiality of your account
            and password. You agree to accept responsibility for all activities that
            occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">4. Reviews & Content</h2>
          <p className="text-muted-foreground">
            By submitting reviews, you grant us a non-exclusive license to display
            your content. Reviews must be honest, based on genuine experience, and
            not contain defamatory, illegal, or misleading content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">5. Disclaimer</h2>
          <p className="text-muted-foreground">
            PeptideFind provides information on an &quot;as is&quot; basis. We make no
            warranties about the accuracy, completeness, or reliability of any
            content on our platform. Product availability, prices, and vendor
            information may change without notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">6. Contact</h2>
          <p className="text-muted-foreground">
            For questions about these terms, please contact us at{" "}
            <a href="mailto:legal@peptidefind.com" className="text-accent hover:underline">
              legal@peptidefind.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
