"use client";
import Link from "next/link";
import { useState } from "react";
import {
    BsAirplane,
    BsBuilding,
    BsCarFront,
    BsCupStraw,
    BsEggFried,
    BsEmojiKiss,
    BsFire,
    BsGeoAlt,
    BsSearch,
    BsTv,
} from "react-icons/bs";
import { FaCrosshairs } from "react-icons/fa6";

const Hero = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const categories = [
        { icon: BsBuilding, name: "Hotels" },
        { icon: BsEggFried, name: "Restaurants" },
        { icon: BsAirplane, name: "Flights" },
        { icon: BsCupStraw, name: "Bars" },
        { icon: BsTv, name: "Arts & Entertainment" },
        { icon: BsCarFront, name: "Automotive" },
        { icon: BsEmojiKiss, name: "Beauty & Spa" },
        { icon: BsFire, name: "Nightlife" },
    ];

    return (
        <section
            className="relative py-16 lg:py-24"
            style={{
                backgroundImage: `url('/images/bg-hero.jpg')`,
                backgroundPosition: "center left",
                backgroundSize: "cover",
            }}
        >
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-gray-900 opacity-80 z-[1]" />

            <div className="container mx-auto px-4 relative z-[9]">
                <div className="py-8 sm:py-12">
                    {/* Titre */}
                    <div className="max-w-4xl mx-auto text-center mb-8">
                        <h6 className="text-white font-normal mb-3 text-lg">
                            Discover &amp; Connect With Great Places Around The World
                        </h6>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-0 font-bold">
                            Let's Discover
                            <span className="relative z-[9] block mt-2">
                                London
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] hidden md:block mt-4">
                                    <svg width="390.5px" height="21.5px" viewBox="0 0 445.5 21.5">
                                        <path
                                            className="fill-indigo-600 opacity-70"
                                            d="M409.9,2.6c-9.7-0.6-19.5-1-29.2-1.5c-3.2-0.2-6.4-0.2-9.7-0.3c-7-0.2-14-0.4-20.9-0.5 c-3.9-0.1-7.8-0.2-11.7-0.3c-1.1,0-2.3,0-3.4,0c-2.5,0-5.1,0-7.6,0c-11.5,0-23,0-34.5,0c-2.7,0-5.5,0.1-8.2,0.1 c-6.8,0.1-13.6,0.2-20.3,0.3c-7.7,0.1-15.3,0.1-23,0.3c-12.4,0.3-24.8,0.6-37.1,0.9c-7.2,0.2-14.3,0.3-21.5,0.6 c-12.3,0.5-24.7,1-37,1.5c-6.7,0.3-13.5,0.5-20.2,0.9C112.7,5.3,99.9,6,87.1,6.7C80.3,7.1,73.5,7.4,66.7,8 C54,9.1,41.3,10.1,28.5,11.2c-2.7,0.2-5.5,0.5-8.2,0.7c-5.5,0.5-11,1.2-16.4,1.8c-0.3,0-0.7,0.1-1,0.1c-0.7,0.2-1.2,0.5-1.7,1 C0.4,15.6,0,16.6,0,17.6c0,1,0.4,2,1.1,2.7c0.7,0.7,1.8,1.2,2.7,1.1c6.6-0.7,13.2-1.5,19.8-2.1c6.1-0.5,12.3-1,18.4-1.6 c6.7-0.6,13.4-1.1,20.1-1.7c2.7-0.2,5.4-0.5,8.1-0.7c10.4-0.6,20.9-1.1,31.3-1.7c6.5-0.4,13-0.7,19.5-1.1c2.7-0.1,5.4-0.3,8.1-0.4 c10.3-0.4,20.7-0.8,31-1.2c6.3-0.2,12.5-0.5,18.8-0.7c2.1-0.1,4.2-0.2,6.3-0.2c11.2-0.3,22.3-0.5,33.5-0.8 c6.2-0.1,12.5-0.3,18.7-0.4c2.2-0.1,4.4-0.1,6.7-0.1c11.5-0.1,23-0.2,34.6-0.4c7.2-0.1,14.4-0.1,21.6-0.1c12.2,0,24.5,0.1,36.7,0.1 c2.4,0,4.8,0.1,7.2,0.2c6.8,0.2,13.5,0.4,20.3,0.6c5.1,0.2,10.1,0.3,15.2,0.4c3.6,0.1,7.2,0.4,10.8,0.6c10.6,0.6,21.1,1.2,31.7,1.8 c2.7,0.2,5.4,0.4,8,0.6c2.9,0.2,5.8,0.4,8.6,0.7c0.4,0.1,0.9,0.2,1.3,0.3c1.1,0.2,2.2,0.2,3.2-0.4c0.9-0.5,1.6-1.5,1.9-2.5 c0.6-2.2-0.7-4.5-2.9-5.2c-1.9-0.5-3.9-0.7-5.9-0.9c-1.4-0.1-2.7-0.3-4.1-0.4c-2.6-0.3-5.2-0.4-7.9-0.6 C419.7,3.1,414.8,2.9,409.9,2.6z"
                                        />
                                    </svg>
                                </span>
                            </span>
                        </h1>
                    </div>

                    {/* Formulaire de recherche */}
                    <div className="max-w-5xl mx-auto">
                        <div className="backdrop-blur-sm bg-white/10 border border-white/25 rounded-lg p-4 mt-5">
                            <form className="flex flex-wrap gap-3 justify-center items-center">
                                {/* Dropdown de recherche */}
                                <div className="w-full lg:w-[41%] relative">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full h-12 pl-12 pr-4 text-base rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                                            placeholder="What are you looking for.."
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            onFocus={() => setShowDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                        />
                                        <span className="absolute top-1/2 left-4 -translate-y-1/2">
                                            <BsSearch className="text-xl text-gray-600" />
                                        </span>
                                    </div>

                                    {/* Menu dropdown */}
                                    {showDropdown && (
                                        <div className="absolute w-full mt-1 bg-white rounded-b-lg shadow-lg z-10 border border-indigo-600">
                                            <ul className="py-1">
                                                {categories.map((category, idx) => {
                                                    const Icon = category.icon;
                                                    return (
                                                        <li key={idx}>
                                                            <button
                                                                type="button"
                                                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    setSelectedCategory(category.name);
                                                                    setShowDropdown(false);
                                                                }}
                                                            >
                                                                <Icon className="text-indigo-600" />
                                                                {category.name}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Select de localisation */}
                                <div className="w-full lg:w-[41%] relative">
                                    <select className="w-full h-12 pl-12 pr-10 text-base rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 appearance-none bg-white">
                                        <option value="-1">Search hotel</option>
                                        <option>San Jacinto, USA</option>
                                        <option>North Dakota, Canada</option>
                                        <option>West Virginia, Paris</option>
                                    </select>
                                    <span className="absolute top-1/2 left-4 -translate-y-1/2">
                                        <BsGeoAlt className="text-xl text-gray-600" />
                                    </span>
                                    <Link
                                        href="#"
                                        className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600 hover:text-indigo-600"
                                    >
                                        <FaCrosshairs />
                                    </Link>
                                </div>

                                {/* Bouton Search */}
                                <div className="w-full lg:w-auto lg:flex-1">
                                    <Link
                                        className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                        href="#"
                                    >
                                        Search
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

