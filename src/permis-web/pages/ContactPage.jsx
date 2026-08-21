import React from 'react'
import Navbar from '../components/shared/Navbar'
import ContactHero from '../components/shared/ContactHero'
import ContactForm from '../components/shared/ContactForm'
import Footer from '../components/shared/Footer'

const ContactPage = () => {
  return (
    <>
    <Navbar />
    <ContactHero />
    <ContactForm />
    <Footer />
    </>
  )
}

export default ContactPage