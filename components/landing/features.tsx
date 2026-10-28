import { LucideIcon } from "lucide-react"

export interface FeatureItemType {
    Icon: LucideIcon,
    title: string,
    description: string
}

interface FeatureProps {
    title: string,
    subTitle: string,
    features: FeatureItemType[]
}

export default function LandingFeatures({ title = "This is a feature",
    subTitle = "It's offers huge features to improve your life",
    features }: FeatureProps) {
    return (
        <section id="about" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        {title}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {subTitle}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <FeatureItem key={i} {...f} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export function FeatureItem({ Icon, title, description }: FeatureItemType) {
    return (
        <div
            key={title}
            className="group relative p-6 rounded-2xl border border-border bg-card hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/40 dark:hover:shadow-sky-900/20 transition-all duration-300"
        >
            <div className="mb-4 inline-flex p-3 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300">
                <Icon className="size-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    )
}