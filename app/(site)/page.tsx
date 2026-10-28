import Image from "next/image";
import Link from "next/link";
import { Stethoscope, CalendarCheck, ShieldCheck, Users } from "lucide-react";
import HeroSection from "@/components/landing/hero-section";
import StateBanner from "@/components/widget/state-banner";
import LandingFeatures, { FeatureItemType } from "@/components/landing/features";
// ── Feature cards ────────────────────────────────────────────────────────────
const features: FeatureItemType[] = [
    {
        Icon: Stethoscope,
        title: "Doctor Profiles",
        description:
            "Maintain rich doctor profiles with specialisations, qualifications and practice details — all in one place.",
    },
    {
        Icon: CalendarCheck,
        title: "Appointment Tracking",
        description:
            "Log and monitor every consultation so nothing slips through the cracks across your patient journey.",
    },
    {
        Icon: ShieldCheck,
        title: "Secure & Private",
        description:
            "Role-based access control ensures your health data is visible only to the people who should see it.",
    },
    {
        Icon: Users,
        title: "Multi-Role Access",
        description:
            "Admins, doctors and patients each get a tailored experience built around their specific needs.",
    },
];

// ── Showcase images ───────────────────────────────────────────────────────────
const showcase = [
    {
        src: "/images/consultation.jpg",
        alt: "Doctor consulting with a patient",
        caption: "Expert Consultations",
        sub: "Connect patients with the right specialist every time.",
    },
    {
        src: "/images/checking.jpg",
        alt: "Doctor checking patient vitals",
        caption: "Thorough Check-ups",
        sub: "Track health metrics and follow-up schedules effortlessly.",
    },
];

export default function LandingPage() {
    return (
        <>
            <HeroSection
                title="Your Health Journey, "
                titleEnd="Fully Tracked"
                subTitle="Doctor Tracker helps patients and healthcare providers manage appointments, specialisations, and medical history — all in one secure platform."
                imageSrc="/images/header_back.jpg"
                topHeader="Healthcare Management, Simplified"
            />
            <StateBanner
                stats={[
                    { value: "2,400+", label: "Doctors Registered" },
                    { value: "18,000+", label: "Appointments Tracked" },
                    { value: "99.9%", label: "Uptime" },
                    { value: "100%", label: "HIPAA Aligned" },
                ]}
            />
            <LandingFeatures
                title="Everything you need to manage healthcare"
                subTitle="Purpose-built tools that make tracking doctor relationships and
                            medical history effortless."
                features={features}
            />
        </>
    );
}
