'use client'
import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Compare listing and choose the best
            </h1>
            <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
              Expand knowledge by reading book Two before narrow not relied on how except moment myself Dejection assurance.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              View all Listing
              <BsArrowRight className="text-xl" />
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src="/assets/images/element/compare.svg"
                alt="Compare illustration"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;