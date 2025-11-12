"use client";

import { footerLinks, topLinks } from "@/../public/assets/data/footer-items"; // Adjusted path
import expresscard from "/assets/images/element/expresscard.svg";
import mastercard from "/assets/images/element/mastercard.svg";
import paypal from "/assets/images/element/paypal.svg";
import visa from "/assets/images/element/visa.svg";
//import logoLight from "/assets/images/logo-light.svg";
import { currentYear, developedByLink } from "@/states";
import Image from "next/image";
import Link from "next/link";
import { BsEnvelope, BsTelephone } from "react-icons/bs";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa6";

const Footer1 = () => { 
  return (
    <footer className="bg-gray-900 pt-5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <Link href="/">
              <Image width={129} className="h-10" src={`url(/assets/images/logo-light.svg)`} alt="logo" />
            </Link>
            <p className="mt-3 text-gray-400">
              Departure defective arranging rapturous did believe him all had supported.
            </p>
            <p className="mt-2">
              <Link href="" className="text-gray-400 hover:text-blue-500 flex items-center">
                <BsTelephone className="mr-2" />
                +1234 568 963
              </Link>
            </p>
            <p className="mt-1">
              <Link href="" className="text-gray-400 hover:text-blue-500 flex items-center">
                <BsEnvelope className="mr-2" />
                example@gmail.com
              </Link>
            </p>
          </div>
          <div className="lg:col-span-3 lg:ml-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {footerLinks.map((item, idx) => (
                <div key={idx} className="col-span-1">
                  <h5 className="text-white mb-2 md:mb-4">{item.title}</h5>
                  <ul className="space-y-2 text-gray-400 hover:text-blue-500">
                    {item.items.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <li key={i}>
                          <Link href={item.link} className="flex items-center">
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
        <div className="mt-5">
          <h5 className="text-white mb-2">Top Links</h5>
          <ul className="flex flex-wrap gap-2 text-gray-400 hover:text-blue-500">
            {topLinks.map((item, idx) => (
              <li key={idx} className="mr-2">
                <Link href={item.link ?? ""} className="inline-block">
                  {item.name}&nbsp;
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
          <div className="sm:col-span-1">
            <h5 className="text-white mb-2">Payment &amp; Security</h5>
            <ul className="flex space-x-2 mt-3">
              <li className="mr-2">
                <Link href="">
                  <Image alt="" src={paypal} className="h-7" width={83} />
                </Link>
              </li>
              <li className="mr-2">
                <Link href="">
                  <Image alt="" src={visa} className="h-7" width={47} />
                </Link>
              </li>
              <li className="mr-2">
                <Link href="">
                  <Image alt="" src={mastercard} className="h-7" width={47} />
                </Link>
              </li>
              <li className="mr-2">
                <Link href="">
                  <Image alt="" src={expresscard} className="h-7" width={47} />
                </Link>
              </li>
            </ul>
          </div>
          <div className="sm:col-span-1 text-sm-end">
            <h5 className="text-white mb-2">Follow us on</h5>
            <ul className="flex justify-end space-x-2 mt-3">
              <li>
                <Link href="" className="bg-blue-600 text-white p-1 rounded">
                  <FaFacebookF size={16} />
                </Link>
              </li>
              <li>
                <Link href="" className="bg-pink-600 text-white p-1 rounded">
                  <FaInstagram size={16} />
                </Link>
              </li>
              <li>
                <Link href="" className="bg-blue-400 text-white p-1 rounded">
                  <FaTwitter size={16} />
                </Link>
              </li>
              <li>
                <Link href="" className="bg-blue-700 text-white p-1 rounded">
                  <FaLinkedinIn size={16} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="mt-4 mb-0 border-gray-700" />
        <div className="py-3 text-center lg:flex lg:justify-between lg:text-left">
          <div className="text-gray-400 hover:text-blue-500">
            Copyrights ©{currentYear} Booking. Build by&nbsp;
            <a href={developedByLink} target="_blank" className="text-gray-400">
              StackBros
            </a>
            .
          </div>
          <ul className="flex flex-wrap justify-center lg:justify-end gap-2 mt-2 lg:mt-0 text-gray-400 hover:text-blue-500">
            <li className="mr-2">
              <Link href="/help/privacy-policy">Privacy policy</Link>
            </li>
            <li className="mr-2">
              <Link href="/help/service">Terms and conditions</Link>
            </li>
            <li>
              <Link href="/help/detail">Refund policy</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer1;