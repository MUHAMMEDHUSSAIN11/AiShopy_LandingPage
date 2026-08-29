import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SocialCommerce from '@/components/SocialCommerce'
import StoreShowcase from '@/components/StoreShowcase'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import MobileApp from '@/components/MobileApp'
import UpcomingFeatures from '@/components/UpcomingFeatures'
import Insights from '@/components/Insights'
import BuiltFor from '@/components/BuiltFor'
import WhyChoose from '@/components/WhyChoose'
import Platform from '@/components/Platform'
import CTA from '@/components/CTA'
import ContactUs from '@/components/ContactUs'
import Footer from '@/components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Navbar />
      <main>
        <Hero />
        <SocialCommerce />
        <StoreShowcase />
        <HowItWorks />
        <Features />
        <Pricing />
        <MobileApp />
        <UpcomingFeatures />
        <Insights />
        <BuiltFor />
        <WhyChoose />
        <Platform />
        <CTA />
        <ContactUs />
      </main>
      <Footer />
    </div>
  )
}
