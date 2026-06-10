"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">DotSkillsHub</h4>

            <p className="text-sm text-muted-foreground">
              The all-in-one platform for multi-tenant e-commerce.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features">Features</Link>
              </li>

              <li>
                <Link href="/pricing">Pricing</Link>
              </li>

              <li>
                <Link href="/security">Security</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">About</Link>
              </li>

              <li>
                <Link href="/blog">Blog</Link>
              </li>

              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>

              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DotSkillsHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
