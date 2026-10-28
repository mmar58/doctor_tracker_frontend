import Image from "next/image";
import Link from "next/link";
import ScrollIndicator from "../widget/scroll-indicator";

interface HeroSectionPropos {
    imageSrc?: string,
    topHeader?: string,
    title?: string,
    titleEnd?: string,
    subTitle?: string
}

export default function HeroSection({ imageSrc = "/images/header_back.jpg",
    topHeader = "This is top header",
    title = "Journey Title, ",
    titleEnd = "Going to end",
    subTitle = "Sub title to explain your experience or journey." }
    : HeroSectionPropos) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background image */}
            <Image
                src={imageSrc}
                alt="Healthcare background"
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

            {/* Hero content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium tracking-wide">
                    {topHeader}
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                    {title}
                    <span className="text-sky-300">{titleEnd}</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                    {subTitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-semibold text-base transition-colors shadow-lg shadow-sky-500/30"
                    >
                        Get Started — it&apos;s free
                    </Link>
                    <Link
                        href="/login"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold text-base transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            <ScrollIndicator />

        </section>
    );
}