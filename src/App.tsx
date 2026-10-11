import { lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { RushdProvider } from './components/rushd/RushdContext'
import Home from './pages/Home'

// تحميل الصفحات عند الحاجة فقط لتسريع فتح المنصة
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Guidance = lazy(() => import('./pages/Guidance'))
const GuidanceTopic = lazy(() => import('./pages/GuidanceTopic'))
const Mawhiba = lazy(() => import('./pages/Mawhiba'))
const Volunteer = lazy(() => import('./pages/Volunteer'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Voice = lazy(() => import('./pages/Voice'))
const Contact = lazy(() => import('./pages/Contact'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Library = lazy(() => import('./pages/Library'))
const GuideReader = lazy(() => import('./pages/GuideReader'))
const Procedures = lazy(() => import('./pages/Procedures'))
const Values = lazy(() => import('./pages/Values'))

/**
 * HashRouter يضمن عمل الروابط وتحديث الصفحة مباشرة على GitHub Pages
 * (الروابط بالشكل: /#/services). عند الانتقال لاستضافة تدعم إعادة التوجيه
 * يمكن استبداله بـ BrowserRouter دون تغيير أي صفحة.
 */
export default function App() {
  return (
    <HashRouter>
      <RushdProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="library" element={<Library />} />
            <Route path="library/:id" element={<GuideReader />} />
            <Route path="procedures" element={<Procedures />} />
            <Route path="values" element={<Values />} />
            <Route path="services" element={<Services />} />
            <Route path="guidance" element={<Guidance />} />
            <Route path="guidance/:id" element={<GuidanceTopic />} />
            <Route path="mawhiba" element={<Mawhiba />} />
            <Route path="volunteer" element={<Volunteer />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="voice" element={<Voice />} />
            <Route path="contact" element={<Contact />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </RushdProvider>
    </HashRouter>
  )
}
