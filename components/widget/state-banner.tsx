export interface StateBannerItemType {
    value: string,
    label: string
}
interface StateBannerProps {
    stats: StateBannerItemType[]
}
export default function StateBanner({ stats = [] }: StateBannerProps) {
    return (
        <section className="bg-sky-600 text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                    <StateBannerItem key={index} value={stat.value} label={stat.label} />
                ))}
            </div>
        </section>
    )
}

export function StateBannerItem({ value, label }: StateBannerItemType) {
    return (
        <div >
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sky-100 text-sm mt-1">{label}</p>
        </div>
    )
}