'use client'
import { ProgramImage } from "@/components/ProgramImage";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import { FaPlus, FaStar, FaTrophy } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";

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
  optimizedProgram?: any | null;
}

const OurListings = ({ compareListings, optimizedProgram }: OurListingsProps) => {
  const [displayedListings, setDisplayedListings] = useState<any[]>([]);
  const [hasOptimizedProgram, setHasOptimizedProgram] = useState(false);

  useEffect(() => {
    setDisplayedListings(recalculateWinners(compareListings));
    setHasOptimizedProgram(false);
  }, [compareListings]);

  const canAddOptimizedProgram = useMemo(() => {
    return Boolean(optimizedProgram) && !hasOptimizedProgram;
  }, [optimizedProgram, hasOptimizedProgram]);

  if (!displayedListings || displayedListings.length === 0) {
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

  function recalculateWinners(programs: any[]) {
    if (!programs || programs.length === 0) {
      return [];
    }

    const cloned = programs.map((program) => {
      const metrics = program.metrics || {};
      return {
        ...program,
        metrics: {
          ...metrics,
          totalCost: metrics.totalCost ? { ...metrics.totalCost, isWinner: false } : null,
          avgCostPerDay: metrics.avgCostPerDay ? { ...metrics.avgCostPerDay, isWinner: false } : null,
          hotel: metrics.hotel ? { ...metrics.hotel, isWinner: false } : null,
          numberOfDays: metrics.numberOfDays ? { ...metrics.numberOfDays, isWinner: false } : null,
          totalActivities: metrics.totalActivities ? { ...metrics.totalActivities, isWinner: false } : null,
          totalDistance: metrics.totalDistance ? { ...metrics.totalDistance, isWinner: false } : null,
          activityDiversity: metrics.activityDiversity ? { ...metrics.activityDiversity, isWinner: false } : null,
          avgIntensity: metrics.avgIntensity ? { ...metrics.avgIntensity, isWinner: false } : null,
          valueForMoney: metrics.valueForMoney ? { ...metrics.valueForMoney, isWinner: false } : null
        }
      };
    });

    const minCost = Math.min(
      ...cloned.map((p) => p.metrics?.totalCost?.numericValue ?? Number.POSITIVE_INFINITY)
    );
    cloned.forEach((p) => {
      if (p.metrics?.totalCost && p.metrics.totalCost.numericValue === minCost) {
        p.metrics.totalCost.isWinner = true;
      }
    });

    const minAvgCost = Math.min(
      ...cloned.map((p) => p.metrics?.avgCostPerDay?.numericValue ?? Number.POSITIVE_INFINITY)
    );
    cloned.forEach((p) => {
      if (
        p.metrics?.avgCostPerDay &&
        p.metrics.avgCostPerDay.numericValue === minAvgCost
      ) {
        p.metrics.avgCostPerDay.isWinner = true;
      }
    });

    const higherIsBetter = ["numberOfDays", "totalActivities", "activityDiversity"];
    higherIsBetter.forEach((metricKey) => {
      const maxValue = Math.max(
        ...cloned.map((p) => p.metrics?.[metricKey]?.numericValue ?? Number.NEGATIVE_INFINITY)
      );
      cloned.forEach((p) => {
        if (
          p.metrics?.[metricKey] &&
          p.metrics[metricKey].numericValue === maxValue &&
          maxValue !== Number.NEGATIVE_INFINITY
        ) {
          p.metrics[metricKey].isWinner = true;
        }
      });
    });

    const maxValueForMoney = Math.max(
      ...cloned.map((p) => p.metrics?.valueForMoney?.score ?? Number.NEGATIVE_INFINITY)
    );
    cloned.forEach((p) => {
      if (
        p.metrics?.valueForMoney &&
        p.metrics.valueForMoney.score === maxValueForMoney &&
        maxValueForMoney !== Number.NEGATIVE_INFINITY
      ) {
        p.metrics.valueForMoney.isWinner = true;
      }
    });

    const maxStars = Math.max(
      ...cloned.map((p) => p.metrics?.hotel?.stars ?? Number.NEGATIVE_INFINITY)
    );
    cloned.forEach((p) => {
      if (
        p.metrics?.hotel &&
        p.metrics.hotel.stars === maxStars &&
        maxStars !== Number.NEGATIVE_INFINITY
      ) {
        p.metrics.hotel.isWinner = true;
      }
    });

    return cloned;
  }

  const handleAddOptimizedProgram = () => {
    if (!optimizedProgram || hasOptimizedProgram) {
      return;
    }

    const updated = recalculateWinners([...displayedListings, optimizedProgram]);
    setDisplayedListings(updated);
    setHasOptimizedProgram(true);
  };

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
                    {displayedListings.map((item, idx) => (
                      <th scope="col" key={idx} className="p-3 align-top">
                        <div className="bg-transparent">
                          {/* ✅ SECTION MODIFIÉE - Remplacement de <img> par <ProgramImage> */}
                          <div className="relative h-64 rounded-xl overflow-hidden">
                            <ProgramImage
                              src={item.image || ''}
                              alt={item.name}
                              className="rounded-xl w-full h-full object-cover"
                            />
                          </div>
                          {/* ✅ FIN DE LA SECTION MODIFIÉE */}

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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    <th colSpan={displayedListings.length + 1} className="p-3 md:p-4 text-left">
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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
                    {displayedListings.map((item, idx) => (
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

            {optimizedProgram && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  onClick={handleAddOptimizedProgram}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-white font-semibold transition-all shadow-lg ${canAddOptimizedProgram
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  disabled={!canAddOptimizedProgram}
                >
                  <FaPlus className="text-lg" />
                  {hasOptimizedProgram
                    ? 'Programme optimisé ajouté'
                    : 'Ajouter un programme optimisé'}
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xl">
                  Combinez automatiquement les meilleurs critères (budget, activités, diversité et hébergement) pour créer un troisième programme basé sur vos comparaisons actuelles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurListings;