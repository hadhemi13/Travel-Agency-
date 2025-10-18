"use client";
import { footerLinks,topLinks } from "@/../public/assets/data/footer-items";

import { currentYear, developedByLink } from "@/states";
import Image from "next/image";
import Link from "next/link";
import { BsEnvelope, BsTelephone } from "react-icons/bs";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa6";

const Footer = () => {
  const paymentMethods = [
    { src: "/assets/images/element/paypal.svg", alt: "PayPal", width: 83 },
    { src: "/assets/images/element/visa.svg", alt: "Visa", width: 47 },
    { src: "/assets/images/element/mastercard.svg", alt: "Mastercard", width: 47 },
    { src: "/assets/images/element/expresscard.svg", alt: "Express", width: 47 },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "#", bgColor: "bg-blue-600 hover:bg-blue-700" },
    { icon: FaInstagram, href: "#", bgColor: "bg-pink-600 hover:bg-pink-700" },
    { icon: FaTwitter, href: "#", bgColor: "bg-sky-500 hover:bg-sky-600" },
    { icon: FaLinkedinIn, href: "#", bgColor: "bg-blue-700 hover:bg-blue-800" },
  ];

  return (
    <footer className="bg-[#2b3139] shadow-lg  pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Logo et contact */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/assets/images/logo-light.svg"
                alt="Logo"
                width={129}
                height={40}
                className="h-10"
              />
            </Link>
            <p className="text-gray-400 mb-4 text-sm">
              Departure defective arranging rapturous did believe him all had supported.
            </p>
            <div className="space-y-2">
              <Link
                href="tel:+1234568963"
                className="flex items-center text-gray-400 hover:text-indigo-400 transition text-sm"
              >
                <BsTelephone className="mr-2" />
                +1234 568 963
              </Link>
              <Link
                href="mailto:example@gmail.com"
                className="flex items-center text-gray-400 hover:text-indigo-400 transition text-sm"
              >
                <BsEnvelope className="mr-2" />
                example@gmail.com
              </Link>
            </div>
          </div>

          {/* Liens du footer */}
          <div className="lg:col-span-8 lg:col-start-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerLinks.map((section, idx) => (
                <div key={idx}>
                  <h5 className="text-white font-semibold mb-4 text-sm">
                    {section.title}
                  </h5>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <li key={i}>
                          <Link
                            href={item.link}
                            className="flex items-center text-gray-400 hover:text-indigo-400 transition text-sm"
                          >
                            {Icon && <Icon className="mr-2" />}
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Links */}
        <div className="mb-8">
          <h5 className="text-white font-semibold mb-3 text-sm">Top Links</h5>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {topLinks.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.link ?? "#"}
                  className="text-gray-400 hover:text-indigo-400 transition text-sm"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Paiements et Réseaux sociaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* Moyens de paiement */}
          <div>
            <h5 className="text-white font-semibold mb-3 text-sm">
              Payment &amp; Security
            </h5>
            <div className="flex gap-2 mt-3">
              {paymentMethods.map((method, idx) => (
                <Link key={idx} href="#" className="block">
                  <Image
                    src={method.src}
                    alt={method.alt}
                    width={method.width}
                    height={30}
                    className="h-8 w-auto opacity-80 hover:opacity-100 transition"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="sm:text-right">
            <h5 className="text-white font-semibold mb-3 text-sm">Follow us on</h5>
            <div className="flex gap-2 mt-3 sm:justify-end">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={idx}
                    href={social.href}
                    className={`${social.bgColor} p-2 rounded shadow-lg transition`}
                  >
                    <Icon className="text-white" size={16} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <hr className="border-gray-800 mb-6" />

        {/* Copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-center lg:text-left">
          <p className="text-gray-400 text-sm">
            Copyrights ©{currentYear} Booking. Build by{" "}
               
            <a
              href={developedByLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-indigo-400 transition">
         
              StackBros
            </a>
            .
          </p>
          <ul className="flex gap-4">
            <li>
              <Link
                href="/help/privacy-policy"
                className="text-gray-400 hover:text-indigo-400 transition text-sm"
              >
                Privacy policy
              </Link>
            </li>
            <li>
              <Link
                href="/help/service"
                className="text-gray-400 hover:text-indigo-400 transition text-sm"
              >
                Terms and conditions
              </Link>
            </li>
            <li>
              <Link
                href="/help/detail"
                className="text-gray-400 hover:text-indigo-400 transition text-sm"
              >
                Refund policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;