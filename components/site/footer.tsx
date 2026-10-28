"use client";

import Link from "next/link";
import { Logo } from "./logo";

const footerLinks = [
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-border bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <Logo />
                    <nav className="flex flex-wrap items-center gap-5">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-8 pt-6 border-t border-border/60 text-center text-xs text-muted-foreground">
                    &copy; 2026 Doctor Tracker. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
