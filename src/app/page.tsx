export const dynamic = 'force-dynamic'

import Hero from '@/components/home/Hero'
import BestSellers from '@/components/home/BestSellers'
import EngagementSection from '@/components/home/EngagementSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BestSellers />
      <EngagementSection />
    </>
  )
}
