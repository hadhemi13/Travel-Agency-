import logoLightSvg from '@/assets/images/logo-light.svg'
import logoSvg from '@/assets/images/logo.svg'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { NavbarBrand } from 'react-bootstrap'

type LogoBoxType = {
  imgClassName?: string
  onlyDark?: boolean
}

const LogoBox = ({ imgClassName, onlyDark }: LogoBoxType) => {
  return (
    <NavbarBrand as={Link} href="/">
      <Image className={clsx(!onlyDark && 'light-mode-item', 'navbar-brand-item', imgClassName)} width={129} src={logoSvg} alt="logo" />
      {!onlyDark && <Image className={clsx('dark-mode-item navbar-brand-item', imgClassName)} width={129} src={logoLightSvg} alt="logo" />}
    </NavbarBrand>
  )
}

export default LogoBox
