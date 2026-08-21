import React from 'react'
import AgencyHero from '../components/shared/AgencyHero'
import Navbar from '../components/shared/Navbar'
import AgencyMain from '../components/shared/AgencyMain'
import Footer from '../components/shared/Footer'

const AgencyPage = () => {
  return (
    <>
    <Navbar />
    <AgencyHero />
    <AgencyMain />
    <Footer />
    </>
  )
}

export default AgencyPage