import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SocialCommerce from '@/components/SocialCommerce'
import StoreShowcase from '@/components/StoreShowcase'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import MobileApp from '@/components/MobileApp'
import UpcomingFeatures from '@/components/UpcomingFeatures'
import Insights from '@/components/Insights'
import BuiltFor from '@/components/BuiltFor'
import WhyChoose from '@/components/WhyChoose'
import Platform from '@/components/Platform'
import CTA from '@/components/CTA'
import ContactUs from '@/components/ContactUs'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <SocialCommerce />
        <StoreShowcase />
        <HowItWorks />
        <Features />
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
