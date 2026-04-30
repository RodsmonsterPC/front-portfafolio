import { Toaster } from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/home/HeroSection'
import AboutSection from '../components/home/AboutSection'
import SkillsSection from '../components/home/SkillsSection'
import ProjectsSection from '../components/home/ProjectsSection'
import ContactSection from '../components/home/ContactSection'
import { useProjects } from '../hooks/useProjects'

export default function HomePage() {
  const { projects, loading } = useProjects()

  return (
    <div className="min-h-screen bg-bgBase">
      <Toaster position="top-right" />
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 pb-8">
        <HeroSection projectCount={projects.length} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection projects={projects} loading={loading} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

