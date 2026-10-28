import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="inline-flex items-center gap-2.5 group py-1">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Doctor <span className="text-muted-foreground font-medium">Tracker</span>
            </span>
        </Link>
    );
}