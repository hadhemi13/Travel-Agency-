import { type IconType } from 'react-icons'
import { FaCar, FaEarthAmericas, FaHotel, FaPlane } from 'react-icons/fa6'

type FooterLink = {
  title: string
  items: {
    name: string
    link?: string
    icon?: IconType
  }[]
}

type TopLink = {
  name: string
  link?: string
}

const footerLinks: FooterLink[] = [
  {
    title: 'Page',
    items: [
      { name: 'About us', link: '/about' },
      { name: 'Contact us', link: '/contact-us/contact' },
      { name: 'News and Blog', link: '/blogs/blog' },
      { name: 'Meet a Team', link: '/pages/our-team' },
    ],
  },
  {
    title: 'Link',
    items: [
      { name: 'Sign up', link: '/auth/sign-up' },
      { name: 'Sign in', link: '/auth/sign-in' },
      { name: 'Privacy Policy', link: '/help/privacy-policy' },
      { name: 'Terms', link: '/help/service' },
      { name: 'Cookie', link: '/hotels/list' },
      { name: 'Support', link: '/help/center' },
    ],
  },
  {
    title: 'Global Site',
    items: [
      { name: 'India', link: '/tours/home' },
      { name: 'California', link: '/tours/grid' },
      { name: 'Indonesia', link: '/tours/detail' },
      { name: 'Canada', link: '/tours/booking' },
      { name: 'Malaysia', link: '/tours/home' }],
  },
  {
    title: 'Booking',
    items: [
      { name: 'Hotel', icon: FaHotel, link: '/hotels/home' },
      { name: 'Flight', icon: FaPlane, link: '/flights/home' },
      { name: 'Tour', icon: FaEarthAmericas, link: '/tours/home' },
      { name: 'Cabs', icon: FaCar, link: '/cabs/home' },
    ],
  },
]

const topLinks: TopLink[] = [
  { name: 'Flights', link: '/flights/home' },
  { name: 'Hotels', link: '/hotels/home' },
  { name: 'Tour', link: '/tours/home' },
  { name: 'Cabs', link: '/cabs/home' },
  { name: 'About', link: '/about' },
  { name: 'Contact us', link: '/contact-us/contact' },
  { name: 'Blogs', link: '/blogs/blog' },
  { name: 'Services', link: '/help/service' },
  { name: 'Detail page', link: '/directories/detail' },
  { name: 'Policy', link: '/help/privacy-policy' },
  { name: 'Testimonials', link: '/hotels/home#hotels-home-testimonial' },
  { name: 'Newsletters', link: '/blogs/blog-detail' },
  { name: 'Podcasts', link: '/listings/add-listing' },
  { name: 'Protests', link: '/listing-pages/compare-listing' },
  { name: 'NewsCyber', link: '/listing-pages/offer-detail' },
  { name: 'Education', link: '/hotels/hotel-detail' },
  { name: 'Sports', link: '/pricing' },
  { name: 'Tech and Auto', link: '/hero/image-gallery' },
  { name: 'Opinion', link: '/coming-soon' },
  { name: 'Share Market', link: '/contact-us/contact' },
]

export { footerLinks, topLinks }
