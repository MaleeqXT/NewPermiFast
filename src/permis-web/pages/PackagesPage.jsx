import React, { useEffect, useState } from 'react'
import Navbar from '../components/shared/Navbar'
import Packages from '../components/shared/Packages'
import ServicesHero from '../components/shared/ServicesHero'
import http from '../../helpers/http.jsx'
import packagesBg from '../assets/Packages-bg.jpeg'
import Footer from '../components/shared/Footer'

const PackagesPage = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    async function loadOffers() {
      try {
        // Fetch both gearbox types explicitly: 0 = manual, 1 = automatic.
        const [manual, automatic] = await Promise.all([
          http.get('/public/offers', { params: { is_auto: 0, status: 1 } }),
          http.get('/public/offers', { params: { is_auto: 1, status: 1 } }),
        ])
        const rows = (response) => response?.data?.data?.data ?? []
        if (active) setOffers([...rows(manual), ...rows(automatic)])
      } catch (requestError) {
        if (active) setError(requestError?.response?.data?.message || "Impossible de charger les formules.")
      } finally {
        if (active) setLoading(false)
      }
    }
    loadOffers()
    return () => { active = false }
  }, [])

  return (
    <>
      <Navbar />
      <ServicesHero
        bgImage={packagesBg}
        eyebrow="FORMULES"
        heading="Nos Formules"
        breadcrumb="Formules"
      />
      <Packages
        packages={offers}
        title="NOS FORMULES DE PERMIS"
        subtitle="Découvrez toutes nos formules de conduite conçues pour répondre à chaque besoin. Que vous recherchiez une formation classique, accélérée, moto ou spécialisée, choisissez la formule qui vous accompagnera jusqu'à la réussite de votre permis."
        showSubtitle={true}
         showTabs={true}
        loading={loading}
        error={error}
      />
      <Footer />
    </>
  )
}

export default PackagesPage
