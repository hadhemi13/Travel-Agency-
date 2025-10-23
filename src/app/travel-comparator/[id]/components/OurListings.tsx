'use client'
import { BsArrowRight, BsCheckLg, BsXLg } from "react-icons/bs";
import { FaPlus, FaStar, FaTrophy } from "react-icons/fa";

const currency = "€";

const renderStars = (count: number) => {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: count }).map((_, idx) => (
        <FaStar key={idx} className="text-yellow-400 text-sm" />
      ))}
    </span>
  );
};

interface OurListingsProps {
  compareListings: any[];
}

const OurListings = ({ compareListings }: OurListingsProps) => {
  if (!compareListings || compareListings.length === 0) {
    return (
      <section className="dark:bg-[#222529] bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Aucun programme à comparer
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dark:bg-[#222529] bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-wrap -mx-3 sm:-mx-4">
          <div className="w-full px-3 sm:px-4">
            <div className="overflow-x-auto">
              <table className="w-full align-middle">
                <thead className="align-top">
                  <tr>
                    <th scope="col" className="p-3 text-left align-top">
                      <p className="text-2xl md:text-3xl lg:text-[40px] font-bold mb-4 md:mb-6 font-['Poppins',sans-serif] text-gray-900 dark:text-white">
                        Compare Programs
                      </p>
                    </th>
                    {compareListings.map((item, idx) => (
                      <th scope="col" key={idx} className="p-3 align-top">
                        <div className="bg-transparent">
                          <img
                            src={item.image || '/assets/images/default-trip.jpg'}
                            className="rounded-xl w-full h-auto object-cover"
                            alt={item.name}
                          />
                          <div className="px-0 pt-3 md:pt-4">
                            <span className="text-base md:text-lg font-semibold block font-['Poppins',sans-serif]">
                              <a href="#" className="text-gray-900 dark:text-white hover:text-[#6366f1] no-underline transition-colors">
                                {item.name}
                              </a>
                            </span>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 md:mt-3 gap-2">
                              <span className="text-xl md:text-2xl font-bold text-[#10b981] mb-0 font-['Poppins',sans-serif]">
                                {currency}{item.totalCost}
                              </span>
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="border-t-0">
                  {/* Total Cost */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Total Cost
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {item.metrics.totalCost.value}
                        {item.metrics.totalCost.isWinner && (
                          <FaTrophy className="inline ml-2 text-yellow-500" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Average Cost Per Day */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Average Cost Per Day
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {item.metrics.avgCostPerDay.value}
                        {item.metrics.avgCostPerDay.isWinner && (
                          <FaTrophy className="inline ml-2 text-yellow-500" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Hotel */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Hotel
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{item.metrics.hotel.value}</span>
                          <div className="flex items-center gap-1">
                            {renderStars(item.metrics.hotel.stars)}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({item.metrics.hotel.stars}★)
                            </span>
                            {item.metrics.hotel.isWinner && (
                              <FaTrophy className="ml-1 text-yellow-500 text-sm" />
                            )}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Number of Days */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Number of Days
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {item.metrics.numberOfDays.value}
                      </td>
                    ))}
                  </tr>

                  {/* Total Activities */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Total Activities
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {item.metrics.totalActivities.value}
                        {item.metrics.totalActivities.isWinner && (
                          <FaTrophy className="inline ml-2 text-yellow-500" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Total Distance Traveled */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Total Distance Traveled
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {item.metrics.totalDistance.value}
                        {item.metrics.totalDistance.isWinner && (
                          <FaTrophy className="inline ml-2 text-yellow-500" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Activity Diversity */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Activity Diversity
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {item.metrics.activityDiversity.value}
                        {item.metrics.activityDiversity.isWinner && (
                          <FaTrophy className="inline ml-2 text-yellow-500" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Average Intensity */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Average Intensity
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {item.metrics.avgIntensity.value}
                        {item.metrics.avgIntensity.isWinner && (
                          <FaTrophy className="inline ml-2 text-yellow-500" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Value for Money */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Value for Money
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {item.metrics.valueForMoney.value}
                        {item.metrics.valueForMoney.isWinner && (
                          <FaTrophy className="inline ml-2 text-yellow-500" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* SECTION: ACTIVITY CATEGORIES */}
                  <tr className="border-t-2 border-gray-300 dark:border-[#3a3d4a]">
                    <th colSpan={compareListings.length + 1} className="p-3 md:p-4 text-left">
                      <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Activity Categories
                      </span>
                    </th>
                  </tr>

                  {/* Cultural Activities */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Cultural Activities
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle">
                        <span className={`text-xl md:text-2xl mb-0 inline-block ${item.categories.culture ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {item.categories.culture ? <BsCheckLg /> : <BsXLg />}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Nature Activities */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Nature Activities
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle">
                        <span className={`text-xl md:text-2xl mb-0 inline-block ${item.categories.nature ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {item.categories.nature ? <BsCheckLg /> : <BsXLg />}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Gastronomy Activities */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Gastronomy Activities
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle">
                        <span className={`text-xl md:text-2xl mb-0 inline-block ${item.categories.gastronomy ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {item.categories.gastronomy ? <BsCheckLg /> : <BsXLg />}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Adventure Activities */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Adventure Activities
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle">
                        <span className={`text-xl md:text-2xl mb-0 inline-block ${item.categories.adventure ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {item.categories.adventure ? <BsCheckLg /> : <BsXLg />}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Relaxation Activities */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Relaxation Activities
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle">
                        <span className={`text-xl md:text-2xl mb-0 inline-block ${item.categories.relaxation ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {item.categories.relaxation ? <BsCheckLg /> : <BsXLg />}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Shopping */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Shopping
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle">
                        <span className={`text-xl md:text-2xl mb-0 inline-block ${item.categories.shopping ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {item.categories.shopping ? <BsCheckLg /> : <BsXLg />}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Nightlife */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Nightlife
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle">
                        <span className={`text-xl md:text-2xl mb-0 inline-block ${item.categories.nightlife ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {item.categories.nightlife ? <BsCheckLg /> : <BsXLg />}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Sports */}
                  <tr className="border-t border-gray-200 dark:border-[#2a2d3a]">
                    <th scope="row" className="p-3 md:p-4 text-left font-bold align-middle">
                      <span className="text-sm md:text-base font-bold mb-0 text-gray-900 dark:text-white font-['Poppins',sans-serif]">
                        Sports
                      </span>
                    </th>
                    {compareListings.map((item, idx) => (
                      <td key={idx} className="p-3 md:p-4 align-middle">
                        <span className={`text-xl md:text-2xl mb-0 inline-block ${item.categories.sports ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {item.categories.sports ? <BsCheckLg /> : <BsXLg />}
                        </span>
                      </td>
                    ))}
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