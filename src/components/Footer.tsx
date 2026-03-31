import Link from "next/link";
import { FlaskConical } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">PeptideFind</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              The most comprehensive peptide comparison platform. Find the best
              prices and vendors for research peptides.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search" className="hover:text-foreground">Search Peptides</Link></li>
              <li><Link href="/vendors" className="hover:text-foreground">Vendor Directory</Link></li>
              <li><Link href="/compare" className="hover:text-foreground">Compare Products</Link></li>
              <li><Link href="/guides" className="hover:text-foreground">Guides & Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Popular Peptides</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/peptide/bpc-157" className="hover:text-foreground">BPC-157</Link></li>
              <li><Link href="/peptide/tb-500" className="hover:text-foreground">TB-500</Link></li>
              <li><Link href="/peptide/ipamorelin" className="hover:text-foreground">Ipamorelin</Link></li>
              <li><Link href="/peptide/sermorelin" className="hover:text-foreground">Sermorelin</Link></li>
              <li><Link href="/peptide/pt-141" className="hover:text-foreground">PT-141</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PeptideFind. All rights reserved.</p>
          <p className="mt-1">
            Disclaimer: PeptideFind is a comparison platform. All products listed are for research purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
