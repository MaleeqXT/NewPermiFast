import React from 'react'
import Navbar from '../components/shared/Navbar'
import Hero from '../components/shared/Hero'
import Cards from '../components/shared/Cards'
import Packages from '../components/shared/Packages'
import Comments from '../components/shared/Comments'
import Footer from '../components/shared/Footer'
import { packages } from '../data/packagesData'

const featuredPackageIds = [
  'manual-evaluation',
  'manual',
  'manual-decouverte',
  'motorcycle',
]

const featuredPackages = featuredPackageIds
  .map((packageId) => packages.find(({ id }) => id === packageId))
  .filter(Boolean)

const HomePage = () => {
  return (
    <>
      <Navbar transparent />
      <Hero />
      <Cards />
      <Packages
        packages={featuredPackages}
        title="CHOISISSEZ LA FORMULE QUI VOUS CONVIENT"
        showSubtitle={false}
      />
      <Comments />
      <Footer />
    </>
  )
}

export default HomePage
