import React from 'react'
import Navbar from '../components/shared/Navbar'
import ServicesHero from '../components/shared/ServicesHero'
import Services from '../components/shared/Services'
import AdditionalServices from '../components/shared/AdditionalServices'
import Footer from '../components/shared/Footer'

const ServicesPage = () => {
  return (
    <>
    <Navbar />
    <ServicesHero />
    <Services />
    <AdditionalServices />
    <Footer />
    </>
  )
}

export default ServicesPage