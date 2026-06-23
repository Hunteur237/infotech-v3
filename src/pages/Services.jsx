import { lazy, Suspense } from 'react'
import ServicesSection from '../components/Services.jsx'
const Load = () => <div style={{ padding: '4rem 2rem', minHeight: '60vh' }}/>
export default function PageServices() {
  return <div style={{ paddingTop: 66 }}><ServicesSection /></div>
}
