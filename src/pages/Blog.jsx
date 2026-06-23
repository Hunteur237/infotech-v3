import { lazy, Suspense } from 'react'
const BlogSection = lazy(() => import('../components/Blog.jsx'))
const Load = () => <div style={{ padding: '4rem', minHeight: '60vh' }}/>
export default function PageBlog() {
  return <div style={{ paddingTop: 66 }}><Suspense fallback={<Load />}><BlogSection /></Suspense></div>
}
