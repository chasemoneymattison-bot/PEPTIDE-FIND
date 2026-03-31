import { PrismaClient, ProductForm, Role, SubscriptionTier } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.clickLog.deleteMany();
  await prisma.priceAlert.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.peptide.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@peptidefind.com",
        name: "Admin User",
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: "vendor@example.com",
        name: "Vendor Manager",
        role: Role.VENDOR_ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: "user@example.com",
        name: "John Researcher",
        role: Role.USER,
      },
    }),
  ]);

  // Create Vendors
  const vendorData = [
    { name: "PeptidePure Labs", slug: "peptidepure-labs", description: "Premium US-based peptide supplier with rigorous third-party lab testing and certificate of analysis for every batch.", website: "https://peptidepure.example.com", location: "Florida, USA", isUSBased: true, overallRating: 4.8, reviewCount: 12, hasLabTesting: true, hasAffiliateProgram: true, subscriptionTier: SubscriptionTier.PREMIUM, isVerified: true, isFeatured: true },
    { name: "BioSynth Peptides", slug: "biosynth-peptides", description: "Research-grade peptides with HPLC and mass spectrometry verification. Based in Arizona with fast domestic shipping.", website: "https://biosynth.example.com", location: "Arizona, USA", isUSBased: true, overallRating: 4.6, reviewCount: 8, hasLabTesting: true, hasAffiliateProgram: true, subscriptionTier: SubscriptionTier.PRO, isVerified: true, isFeatured: true },
    { name: "CorePeptide", slug: "corepeptide", description: "Affordable research peptides with consistent quality. All products come with third-party COA.", website: "https://corepeptide.example.com", location: "Texas, USA", isUSBased: true, overallRating: 4.3, reviewCount: 15, hasLabTesting: true, hasAffiliateProgram: false, subscriptionTier: SubscriptionTier.PRO, isVerified: true, isFeatured: false },
    { name: "PeptiGlobal", slug: "peptiglobal", description: "International peptide supplier offering competitive prices and worldwide shipping from state-of-the-art facilities.", website: "https://peptiglobal.example.com", location: "United Kingdom", isUSBased: false, overallRating: 4.1, reviewCount: 6, hasLabTesting: true, hasAffiliateProgram: true, subscriptionTier: SubscriptionTier.PRO, isVerified: true, isFeatured: false },
    { name: "Swiss Chems", slug: "swiss-chems", description: "European peptide manufacturer with pharmaceutical-grade synthesis and comprehensive testing protocols.", website: "https://swisschems.example.com", location: "Switzerland", isUSBased: false, overallRating: 4.7, reviewCount: 10, hasLabTesting: true, hasAffiliateProgram: true, subscriptionTier: SubscriptionTier.PREMIUM, isVerified: true, isFeatured: true },
    { name: "PeptideWarehouse", slug: "peptidewarehouse", description: "Large inventory of research peptides at wholesale prices. Bulk discounts available for laboratories.", website: "https://peptidewarehouse.example.com", location: "California, USA", isUSBased: true, overallRating: 3.9, reviewCount: 7, hasLabTesting: false, hasAffiliateProgram: false, subscriptionTier: SubscriptionTier.FREE, isVerified: false, isFeatured: false },
    { name: "NovaPep Research", slug: "novapep-research", description: "Boutique peptide synthesis lab focused on rare and custom peptides with exceptional purity standards.", website: "https://novapep.example.com", location: "Massachusetts, USA", isUSBased: true, overallRating: 4.5, reviewCount: 4, hasLabTesting: true, hasAffiliateProgram: false, subscriptionTier: SubscriptionTier.PRO, isVerified: true, isFeatured: false },
    { name: "AsiaPeptide Co", slug: "asiapeptide-co", description: "Direct-from-manufacturer peptides at competitive prices with international express shipping.", website: "https://asiapeptide.example.com", location: "China", isUSBased: false, overallRating: 3.5, reviewCount: 9, hasLabTesting: false, hasAffiliateProgram: true, subscriptionTier: SubscriptionTier.FREE, isVerified: false, isFeatured: false },
    { name: "PureRaw Peptides", slug: "pureraw-peptides", description: "Australian peptide supplier known for exceptional customer service and fast Oceania delivery.", website: "https://pureraw.example.com", location: "Australia", isUSBased: false, overallRating: 4.4, reviewCount: 5, hasLabTesting: true, hasAffiliateProgram: true, subscriptionTier: SubscriptionTier.PRO, isVerified: true, isFeatured: false },
    { name: "AmeriPeptide", slug: "ameripeptide", description: "New York-based peptide company offering next-day domestic shipping and quality guarantee.", website: "https://ameripeptide.example.com", location: "New York, USA", isUSBased: true, overallRating: 4.2, reviewCount: 3, hasLabTesting: true, hasAffiliateProgram: false, subscriptionTier: SubscriptionTier.FREE, isVerified: false, isFeatured: false },
  ];

  const vendors = await Promise.all(
    vendorData.map((v) => prisma.vendor.create({ data: v }))
  );

  // Create Peptides
  const peptideData = [
    { name: "BPC-157", slug: "bpc-157", description: "Body Protection Compound-157 is a pentadecapeptide composed of 15 amino acids. It is a partial sequence of body protection compound (BPC) found in human gastric juice. Research suggests potential for tissue repair and regeneration.", category: "Recovery", aliases: ["Body Protection Compound 157", "PL 14736", "PL-10", "Bepecin"], casNumber: "137525-51-0" },
    { name: "TB-500", slug: "tb-500", description: "Thymosin Beta-4 fragment, a synthetic peptide that mimics the action of a naturally occurring 43-amino acid peptide. Research focuses on its role in cell migration, tissue repair, and anti-inflammatory properties.", category: "Recovery", aliases: ["Thymosin Beta 4", "Tβ4"], casNumber: "77591-33-4" },
    { name: "PT-141", slug: "pt-141", description: "Bremelanotide (PT-141) is a synthetic peptide analog of alpha-melanocyte stimulating hormone. It acts as a melanocortin receptor agonist and has been studied for its effects on sexual function.", category: "Sexual Health", aliases: ["Bremelanotide"], casNumber: "189691-06-3" },
    { name: "Sermorelin", slug: "sermorelin", description: "Sermorelin is a synthetic analog of growth hormone-releasing hormone (GHRH) consisting of the first 29 amino acids. It stimulates the pituitary gland to produce and release growth hormone.", category: "Growth Hormone", aliases: ["GRF 1-29", "GHRH(1-29)"], casNumber: "86168-78-7" },
    { name: "CJC-1295", slug: "cjc-1295", description: "CJC-1295 is a synthetic analog of growth hormone-releasing hormone (GHRH). Available with or without Drug Affinity Complex (DAC), it has a prolonged half-life compared to natural GHRH.", category: "Growth Hormone", aliases: ["CJC-1295 DAC", "CJC-1295 No DAC", "Modified GRF 1-29"], casNumber: "863288-34-0" },
    { name: "Ipamorelin", slug: "ipamorelin", description: "Ipamorelin is a selective growth hormone secretagogue and ghrelin receptor agonist. It is a pentapeptide with a clean growth hormone release profile without significant effects on cortisol or prolactin.", category: "Growth Hormone", aliases: ["NNC 26-0161"], casNumber: "170851-70-4" },
    { name: "GHK-Cu", slug: "ghk-cu", description: "GHK-Cu (copper peptide) is a naturally occurring tripeptide with high affinity for copper. Research has explored its role in wound healing, collagen synthesis, and skin remodeling.", category: "Skin & Anti-Aging", aliases: ["Copper Peptide", "GHK Copper"], casNumber: "49557-75-7" },
    { name: "Selank", slug: "selank", description: "Selank is a synthetic analog of the immunomodulatory peptide tuftsin. Developed at the Institute of Molecular Genetics of the Russian Academy of Sciences, it has been studied for anxiolytic and nootropic properties.", category: "Cognitive", aliases: ["TP-7"], casNumber: "129954-34-3" },
    { name: "Semax", slug: "semax", description: "Semax is a synthetic peptide derived from adrenocorticotropic hormone (ACTH). It is a heptapeptide studied for its neuroprotective and cognitive-enhancing effects.", category: "Cognitive", aliases: ["ACTH(4-7)-PGP", "Heptapeptide Semax"], casNumber: "80714-61-0" },
    { name: "Thymosin Alpha-1", slug: "thymosin-alpha-1", description: "Thymosin Alpha 1 is a peptide fragment derived from prothymosin alpha. It has been extensively studied for its immunomodulatory properties and role in T-cell maturation.", category: "Immune", aliases: ["Tα1", "Zadaxin"], casNumber: "62304-98-7" },
    { name: "DSIP", slug: "dsip", description: "Delta Sleep-Inducing Peptide is a neuropeptide that has been studied for its potential role in sleep regulation, stress response, and neuromodulation.", category: "Sleep", aliases: ["Delta Sleep Inducing Peptide"], casNumber: "62568-57-4" },
    { name: "Epithalon", slug: "epithalon", description: "Epithalon (Epitalon) is a synthetic tetrapeptide studied for its potential effects on telomerase activity and its role in aging research.", category: "Anti-Aging", aliases: ["Epitalon", "Epithalone"], casNumber: "307297-39-8" },
    { name: "Melanotan II", slug: "melanotan-ii", description: "Melanotan II is a synthetic analog of alpha-melanocyte stimulating hormone. Research has focused on its effects on melanogenesis and photoprotection.", category: "Tanning", aliases: ["MT-2", "MT2"], casNumber: "121062-08-6" },
    { name: "AOD-9604", slug: "aod-9604", description: "AOD-9604 is a modified fragment (176-191) of human growth hormone. It has been studied for its potential effects on fat metabolism without the growth-promoting effects of full GH.", category: "Weight Management", aliases: ["Anti-Obesity Drug 9604", "hGH Fragment 176-191"], casNumber: "221231-10-3" },
    { name: "Tesamorelin", slug: "tesamorelin", description: "Tesamorelin is a synthetic analog of growth hormone-releasing hormone. It is the only GHRH analog FDA-approved (as Egrifta) for the reduction of excess abdominal fat in HIV patients.", category: "Growth Hormone", aliases: ["Egrifta", "TH9507"], casNumber: "218949-48-5" },
    { name: "GHRP-6", slug: "ghrp-6", description: "Growth Hormone Releasing Peptide-6 is a synthetic hexapeptide that acts as a potent ghrelin receptor agonist, stimulating growth hormone release from the anterior pituitary.", category: "Growth Hormone", aliases: ["Growth Hormone Releasing Hexapeptide"], casNumber: "87616-84-0" },
    { name: "GHRP-2", slug: "ghrp-2", description: "Growth Hormone Releasing Peptide-2 is a synthetic hexapeptide GH secretagogue. It is considered more potent than GHRP-6 with fewer appetite-stimulating effects.", category: "Growth Hormone", aliases: ["Pralmorelin"], casNumber: "158861-67-7" },
    { name: "Hexarelin", slug: "hexarelin", description: "Hexarelin is a synthetic hexapeptide growth hormone secretagogue. It is one of the strongest GHRP peptides studied for growth hormone release.", category: "Growth Hormone", aliases: ["Examorelin"], casNumber: "140703-51-1" },
    { name: "Kisspeptin-10", slug: "kisspeptin-10", description: "Kisspeptin-10 is a truncated form of the kisspeptin family of peptides. It plays a crucial role in the regulation of reproductive hormones through the HPG axis.", category: "Hormonal", aliases: ["Metastin 45-54", "KP-10"], casNumber: "374675-21-5" },
    { name: "LL-37", slug: "ll-37", description: "LL-37 is the only human cathelicidin antimicrobial peptide. It plays a role in innate immune defense against bacterial, viral, and fungal infections.", category: "Immune", aliases: ["Cathelicidin", "hCAP-18"], casNumber: "154947-66-7" },
    { name: "Follistatin 344", slug: "follistatin-344", description: "Follistatin 344 is an autocrine glycoprotein that binds and neutralizes members of the TGF-β superfamily, with particular focus on activin. Studied for its role in muscle growth regulation.", category: "Muscle Growth", aliases: ["FST-344", "FS-344"], casNumber: "80449-31-6" },
    { name: "IGF-1 LR3", slug: "igf-1-lr3", description: "IGF-1 LR3 is a modified version of insulin-like growth factor 1 with an extended half-life. The LR3 modification results in reduced binding to IGF binding proteins.", category: "Growth Hormone", aliases: ["Long R3 IGF-1", "Long Arginine 3-IGF-1"], casNumber: "946870-92-4" },
    { name: "Gonadorelin", slug: "gonadorelin", description: "Gonadorelin is a synthetic decapeptide identical to naturally occurring gonadotropin-releasing hormone (GnRH). It stimulates the release of FSH and LH from the pituitary.", category: "Hormonal", aliases: ["GnRH", "LHRH", "Luteinizing Hormone Releasing Hormone"], casNumber: "33515-09-2" },
    { name: "Bremelanotide", slug: "bremelanotide", description: "Bremelanotide is a synthetic cyclic heptapeptide melanocortin receptor agonist. FDA-approved as Vyleesi for the treatment of hypoactive sexual desire disorder.", category: "Sexual Health", aliases: ["PT-141", "Vyleesi"], casNumber: "189691-06-3" },
    { name: "Snap-8", slug: "snap-8", description: "Snap-8 (Acetyl Octapeptide-3) is a peptide that mimics the N-terminal end of SNAP-25. It is primarily studied in cosmetic research for its potential effects on expression lines.", category: "Skin & Anti-Aging", aliases: ["Acetyl Octapeptide-3", "SNAP-8"], casNumber: "868844-74-0" },
  ];

  const peptides = await Promise.all(
    peptideData.map((p) => prisma.peptide.create({ data: p }))
  );

  // Create Products - 3-5 per peptide across different vendors
  const forms: ProductForm[] = ["LYOPHILIZED", "PRE_MIXED", "CAPSULE", "NASAL"];
  const productEntries: Array<{
    vendorId: string;
    peptideId: string;
    price: number;
    quantity: number;
    unit: string;
    purity: number;
    form: ProductForm;
    inStock: boolean;
    productUrl: string;
  }> = [];

  for (const peptide of peptides) {
    // Each peptide gets 3-5 vendor listings
    const numListings = 3 + Math.floor(Math.random() * 3);
    const shuffled = [...vendors].sort(() => Math.random() - 0.5).slice(0, numListings);

    for (const vendor of shuffled) {
      const basePrice = 25 + Math.random() * 150;
      const quantity = [5, 10, 15, 20, 30][Math.floor(Math.random() * 5)];
      const purity = 97 + Math.random() * 2.9;
      const form = forms[Math.floor(Math.random() * (peptide.category === "Cognitive" ? 4 : 2))];

      productEntries.push({
        vendorId: vendor.id,
        peptideId: peptide.id,
        price: Math.round(basePrice * 100) / 100,
        quantity,
        unit: "mg",
        purity: Math.round(purity * 10) / 10,
        form,
        inStock: Math.random() > 0.15,
        productUrl: `https://${vendor.slug}.example.com/products/${peptide.slug}`,
      });
    }
  }

  const products = await Promise.all(
    productEntries.map((p) => prisma.product.create({ data: p }))
  );

  console.log(`Created ${products.length} products`);

  // Create Reviews
  const reviewTitles = [
    "Excellent quality and fast shipping",
    "Good product, reasonable price",
    "Top-notch purity, will order again",
    "Decent but shipping was slow",
    "Great customer service",
    "Lab results matched claims",
    "Best vendor I've tried",
    "Average quality for the price",
    "Very impressed with packaging",
    "Would recommend to colleagues",
    "Consistent quality batch to batch",
    "Fast delivery and good communication",
    "Purity was lower than expected",
    "Outstanding product quality",
    "Fair pricing for research grade",
    "COA was provided promptly",
    "Reliable source for our lab",
    "Mixed experience overall",
    "Premium quality peptides",
    "Solid vendor, no complaints",
  ];

  const reviewBodies = [
    "Ordered multiple times and consistently received high-quality product. The COA matched our independent testing. Shipping was fast with proper cold chain handling.",
    "Good overall experience. Product arrived well-packaged and within the expected timeframe. Purity was within acceptable range for our research needs.",
    "This vendor has become our go-to source. The purity consistently tests above 98% in our lab. Customer support is responsive and knowledgeable.",
    "Product quality is fine but delivery took longer than expected. Communication could be improved. Would still order again based on the product quality alone.",
    "Had an issue with my first order and their support team resolved it quickly. Replacement was sent immediately. Very professional operation.",
    "We ran our own HPLC analysis and results were consistent with the provided COA. This is exactly what you want from a research peptide supplier.",
    "After trying several vendors, this one stands out for consistency and reliability. Never had a bad batch. Their quality control is clearly superior.",
    "Decent product for the price point. Not the highest purity available but adequate for preliminary research. Good value proposition.",
    "The packaging and shipping process is clearly designed by someone who understands peptide stability. Arrived in perfect condition with ice packs still frozen.",
    "Recommended this vendor to several colleagues in our department. Everyone has had positive experiences. Bulk pricing is also very competitive.",
    "We've placed monthly orders for over a year now. Every batch has been consistent in quality. This kind of reliability is rare in this market.",
    "Order processing was quick and tracking information was provided immediately. Product arrived 2 days earlier than estimated. Well packaged.",
    "The purity on our last order was about 1% lower than the COA indicated. Not a deal-breaker but worth noting. Previous orders were spot-on.",
    "Exceptional quality across all peptides we've ordered. Their synthesis process clearly prioritizes purity. Premium product at a fair price.",
    "Competitive pricing without sacrificing quality. The COA is detailed and our spot checks have always confirmed the stated purity levels.",
    "Requested the COA before ordering and it was emailed within an hour. Very transparent about their testing procedures and sourcing.",
    "Our laboratory has been using this vendor for 18 months. Consistent, reliable, and professional. They understand the needs of research facilities.",
    "Some orders have been great, others mediocre. Inconsistency is a concern. When they're good, they're very good, but it's not guaranteed.",
    "If you want the best quality and don't mind paying a small premium, this is the vendor. Every product we've tested has exceeded purity claims.",
    "Straightforward ordering process, fair prices, and reliable quality. Nothing flashy but they deliver exactly what they promise every time.",
  ];

  const reviewEntries = [];
  for (let i = 0; i < 40; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const rating = Math.max(1, Math.min(5, Math.round(vendor.overallRating + (Math.random() - 0.5) * 2)));

    reviewEntries.push({
      userId: user.id,
      vendorId: vendor.id,
      rating,
      title: reviewTitles[i % reviewTitles.length],
      body: reviewBodies[i % reviewBodies.length],
      isVerifiedPurchase: Math.random() > 0.3,
      helpfulCount: Math.floor(Math.random() * 25),
    });
  }

  await Promise.all(
    reviewEntries.map((r) => prisma.review.create({ data: r }))
  );

  console.log("Seeding complete!");
  console.log(`Users: ${users.length}`);
  console.log(`Vendors: ${vendors.length}`);
  console.log(`Peptides: ${peptides.length}`);
  console.log(`Products: ${products.length}`);
  console.log(`Reviews: ${reviewEntries.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
