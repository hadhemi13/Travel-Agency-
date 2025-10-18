'use client'
import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    return (
        <section className="pt-6 pb-8 md:pb-12">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1500px] mx-auto">
                    <div className="bg-gray-50 dark:bg-[#2a2c31] rounded-3xl relative overflow-hidden px-8 py-16 xl:px-20 xl:py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="lg:col-span-1">
                                <h1 className="mb-4 text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 dark:text-white leading-tight">
                                    Compare listing and choose the best
                                </h1>
                                <p className="mb-8 text-gray-600 dark:text-[#9ca3af] text-base md:text-lg">
                                    Expand knowledge by reading book Two before narrow not
                                    relied on how except moment myself Dejection assurance.
                                </p>
                                <Link
                                    href=""
                                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 group
                           text-white bg-[#6366f1] border border-[#6366f1]
                           hover:bg-[#4f46e5] hover:border-[#4f46e5]
                           dark:text-white dark:bg-[#6366f1] dark:border-[#6366f1]
                           dark:hover:bg-[#4f46e5] dark:hover:border-[#4f46e5]"
                                >
                                    <span>View all Listing</span>
                                    <BsArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                            <div className="lg:col-span-1 flex justify-center lg:justify-end">
                                <Image
                                    alt="Compare listings illustration"
                                    src="/assets/images/element/compare.svg"
                                    width={600}
                                    height={450}
                                    className="w-full max-w-[600px] h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;