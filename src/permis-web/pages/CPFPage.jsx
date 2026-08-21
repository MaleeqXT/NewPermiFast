import React from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import CPFHero from '../components/shared/CPFHero'
import Packages from '../components/shared/Packages'
import { packages } from '../data/packagesData'


const CPFPage = () => {
  return (
    <>
    <Navbar />
    <CPFHero />
    <Packages
        packages={packages}
        title="CPF"
        subtitle="Découvrez toutes nos formules de conduite conçues pour répondre à chaque besoin. Que vous recherchiez une formation classique, accélérée, moto ou spécialisée, choisissez la formule qui vous accompagnera jusqu'à la réussite de votre permis."
        showSubtitle={false}
        showTabs={true}
        showCpfFilter={true}
      />
    <Footer />
    </>
  )
}

export default CPFPage