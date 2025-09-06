import React from 'react'
import TrustPage from './../../components/TrustPage';
import ProblemPage from './../../components/ProblemPage';
import HowPage from './../../components/HowPage';
import InnovationPage from './../../components/InnovationPage';
import Navbar from '../../components/navbar';
export default function About() {
  return (
    <>
    <Navbar />
      <ProblemPage />
      <HowPage />
      <InnovationPage />
      <TrustPage />
    </>
  )
}
