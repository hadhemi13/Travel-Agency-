"use client";

import useToggle from "@/hooks/useToggle";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsGridFill, BsListUl, BsSliders, BsStarFill } from "react-icons/bs";
import * as yup from "yup";

const amenities = [
  "Air Conditioning",
  "Room Services",
  "Dining",
  "Caretaker",
  "Free Internet",
  "Business Service",
  "Bonfire",
  "Mask",
  "Spa",
  "Swimming pool",
  "Fitness Centre",
  "Bar",
];

const HotelListFilter = () => {
  const { isOpen, toggle } = useToggle();
  const [priceRange, setPriceRange] = useState<string[]>(["700", "1500"]);

  const filterSchema = yup.object({
    hotelName: yup.string().required("Please enter hotel name"),
  });
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(filterSchema),
  });

  return (
    <section className="pt-0 pb-4 bg-gray-50 dark:bg-[#222529]">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center">
          <button
            onClick={toggle}
            className="bg-[#8e85e6] text-white px-4 py-2 rounded flex items-center hover:bg-[#7a6deb] transition-colors"
            data-collapse-toggle="collapseFilter"
          >
            <BsSliders className="mr-2" />
            Afficher les filtres
          </button>
          <ul className="flex space-x-2">
            <li>
              <Link href="/hotels/list" className="text-gray-600 dark:text-gray-300 hover:text-[#8e85e6] dark:hover:text-[#7a6deb] p-2">
                <BsListUl size={16} />
              </Link>
            </li>
            <li>
              <Link href="/hotels/grid" className="text-[#8e85e6] p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                <BsGridFill size={16} />
              </Link>
            </li>
          </ul>
        </div>
        <div id="collapseFilter" className={isOpen ? "block" : "hidden"} aria-expanded={isOpen}>
          <div className="bg-white dark:bg-gray-800 p-4 mt-4 rounded-lg">
            <form onSubmit={handleSubmit(() => { })} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <input
                  name="hotelName"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-[#8e85e6]"
                  placeholder="Nom de l'hôtel"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-gray-700 dark:text-gray-300">Gamme de prix</label>
                <div className="flex justify-between mt-1">
                  <input type="text" value={priceRange[0]} readOnly className="w-16 p-1 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded" />
                  <input type="text" value={priceRange[1]} readOnly className="w-16 p-1 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded" />
                </div>
                <div className="mt-2">
                  {/* Placeholder for Nouislider - replace with Tailwind-compatible slider if possible */}
                  <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-gray-700 dark:text-gray-300">Filtres populaires</label>
                <select className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-[#8e85e6]">
                  <option value={-1}>Select Option</option>
                  <option>Recently search</option>
                  <option>Most popular</option>
                  <option>Top rated</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-gray-700 dark:text-gray-300">Customer Rating</label>
                <div className="flex space-x-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-1" /> 3+
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-1" /> 3.5+
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-1" /> 4+
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-1" /> 4.5+
                  </label>
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-gray-700 dark:text-gray-300">Star Rating</label>
                <div className="flex space-x-2">
                  {Array.from(new Array(5)).map((_val, idx) => (
                    <label key={idx} className="flex items-center">
                      <input type="checkbox" className="mr-1" /> {idx + 1} <BsStarFill />
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-gray-700 dark:text-gray-300">Hotel Type</label>
                <select className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-[#8e85e6]">
                  <option value={-1}>Select Option</option>
                  <option>Free Cancellation Available</option>
                  <option>Pay At Hotel Available</option>
                  <option>Free Breakfast Included</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-gray-700 dark:text-gray-300">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {amenities.map((item, idx) => (
                    <label key={idx} className="flex items-center">
                      <input type="checkbox" className="mr-1" /> {item}
                    </label>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <Link href="" className="text-[#8e85e6] dark:text-[#7a6deb] mr-3">Clear all</Link>
                <button type="submit" className="bg-[#8e85e6] hover:bg-[#7a6deb] text-white px-4 py-2 rounded transition-colors">
                  Appliquer les filtres
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelListFilter;