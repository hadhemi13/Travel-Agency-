'use client'
import { useState } from 'react';
import { BsArrowRight, BsCheckLg, BsXLg } from "react-icons/bs";
import { FaPlus, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

// Mock data pour la démo
const currency = "$";
const compareListings = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    name: "Courtyard by Marriott New York",
    price: "750"
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    name: "Club Quarters Hotel",
    price: "800"
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    name: "Pride moon Village Resort & Spa",
    price: "1000"
  }
];

const OurListings = () => {
  return (
    <section className="dark:bg-[#222529]  py-8 md:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-wrap -mx-3 sm:-mx-4">
          <div className="w-full px-3 sm:px-4">
            <div className="overflow-x-auto">
              <table className="w-full align-middle">
                <thead className="align-top">
                  <tr>
                    <th scope="col" className="p-3 text-left align-top">
                      <p className="text-2xl md:text-3xl lg:text-[40px] font-bold mb-4 md:mb-6 font-['Poppins',sans-serif] text-white">
                        Compare Our Listing
                      </p>
                      <button className="bg-[#6366f1] hover:bg-[#5558dd] active:bg-[#4f52cc] text-white rounded-full w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] inline-flex items-center justify-center text-lg lg:text-2xl mb-0 transition-all duration-150 focus:shadow-[0_0_0_0.25rem_rgba(99,102,241,0.5)]">
                        <FaPlus />
                      </button>
                    </th>
                    {compareListings.map((item, idx) => {
                      return (
                        <th scope="col" key={idx} className="p-3 align-top">
                          <div className="bg-transparent">
                            <img
                              src={item.image}
                              className="rounded-xl w-full h-auto object-cover"
                              alt={item.name}
                            />
                            <div className="px-0 pt-3 md:pt-4">
                              <span className="text-base md:text-lg font-semibold block font-['Poppins',sans-serif]">
                                <a href="#" className="text-white hover:text-[#6366f1] no-underline transition-colors">{item.name}</a>
                              </span>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 md:mt-3 gap-2">
                                <span className="text-xl md:text-2xl font-bold text-[#10b981] mb-0 font-['Poppins',sans-serif]">
                                  {currency}{item.price}
                                </span>
                                <a
                                  href="#"
                                  className="text-xs md:text-sm text-[#8b8bff] hover:text-[#a3a3ff] mb-0 p-0 inline-flex items-center no-underline font-medium transition-colors"
                                >
                                  View Listing
                                  <BsArrowRight className="ml-2" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="border-t-0">
                  <tr className="border-t border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-white font-['Poppins',sans-serif]">Rating</span>
                    </th>
                    <td className="p-3 md:p-4 align-middle">
                      <ul className="flex list-none mb-0 p-0 gap-1">
                        {Array.from(new Array(4)).map((_val, idx) => (
                          <li className="inline-block" key={idx}>
                            <FaStar size={16} className="text-yellow-400 md:w-[18px] md:h-[18px]" />
                          </li>
                        ))}
                        <li className="inline-block">
                          <FaRegStar size={16} className="text-yellow-400 md:w-[18px] md:h-[18px]" />
                        </li>
                      </ul>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <ul className="flex list-none mb-0 p-0 gap-1">
                        {Array.from(new Array(4)).map((_val, idx) => (
                          <li className="inline-block" key={idx}>
                            <FaStar size={16} className="text-yellow-400 md:w-[18px] md:h-[18px]" />
                          </li>
                        ))}
                        <li className="inline-block">
                          <FaStarHalfAlt size={15} className="text-yellow-400 md:w-[18px] md:h-[18px]" />
                        </li>
                      </ul>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <ul className="flex list-none mb-0 p-0 gap-1">
                        {Array.from(new Array(5)).map((_val, idx) => (
                          <li className="inline-block" key={idx}>
                            <FaStar size={16} className="text-yellow-400 md:w-[18px] md:h-[18px]" />
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-t border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-white font-['Poppins',sans-serif]">Floor area</span>
                    </th>
                    <td className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-300">1700 sq.ft</td>
                    <td className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-300">1500 sq.ft</td>
                    <td className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-300">1650 sq.ft</td>
                  </tr>
                  <tr className="border-t border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-white font-['Poppins',sans-serif]">Bedroom</span>
                    </th>
                    <td className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-300">3 Bedroom 4 Beds</td>
                    <td className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-300">2 Bedroom 3 Beds</td>
                    <td className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-300">1 Bedroom 2 Beds</td>
                  </tr>
                  <tr className="border-t border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-white font-['Poppins',sans-serif]">Bathroom</span>
                    </th>
                    <td className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-300">2 Showers</td>
                    <td className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-300">2 Showers 1 Bathtub</td>
                    <td className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-300">1 Shower 1 Bathtub</td>
                  </tr>
                  <tr className="border-t border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-white font-['Poppins',sans-serif]">Swimming Pool</span>
                    </th>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#10b981] mb-0 inline-block">
                        <BsCheckLg />
                      </span>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#ef4444] mb-0 inline-block">
                        <BsXLg />
                      </span>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#ef4444] mb-0 inline-block">
                        <BsXLg />
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-white font-['Poppins',sans-serif]">Air conditioning</span>
                    </th>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#10b981] mb-0 inline-block">
                        <BsCheckLg />
                      </span>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#10b981] mb-0 inline-block">
                        <BsCheckLg />
                      </span>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#10b981] mb-0 inline-block">
                        <BsCheckLg />
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-white font-['Poppins',sans-serif]">Gym</span>
                    </th>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#ef4444] mb-0 inline-block">
                        <BsXLg />
                      </span>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#ef4444] mb-0 inline-block">
                        <BsXLg />
                      </span>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#10b981] mb-0 inline-block">
                        <BsCheckLg />
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-white font-['Poppins',sans-serif]">Internet</span>
                    </th>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#10b981] mb-0 inline-block">
                        <BsCheckLg />
                      </span>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#10b981] mb-0 inline-block">
                        <BsCheckLg />
                      </span>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <span className="text-xl md:text-2xl text-[#10b981] mb-0 inline-block">
                        <BsCheckLg />
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-white font-['Poppins',sans-serif]">Actions</span>
                    </th>
                    <td className="p-3 md:p-4 align-middle">
                      <button className="border border-[#6366f1] text-[#8b8bff] hover:bg-[#6366f1] hover:text-white rounded-lg px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm mb-0 transition-all duration-150 font-medium focus:shadow-[0_0_0_0.25rem_rgba(99,102,241,0.3)]">
                        Remove
                      </button>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <button className="border border-[#6366f1] text-[#8b8bff] hover:bg-[#6366f1] hover:text-white rounded-lg px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm mb-0 transition-all duration-150 font-medium focus:shadow-[0_0_0_0.25rem_rgba(99,102,241,0.3)]">
                        Remove
                      </button>
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <button className="border border-[#6366f1] text-[#8b8bff] hover:bg-[#6366f1] hover:text-white rounded-lg px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm mb-0 transition-all duration-150 font-medium focus:shadow-[0_0_0_0.25rem_rgba(99,102,241,0.3)]">
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurListings;