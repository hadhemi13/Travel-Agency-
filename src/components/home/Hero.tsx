import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gray-950 dark:bg-gray-900 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find the top <br />
              <span className="relative inline-block">
                Hotels nearby.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 445.5 21.5"
                  preserveAspectRatio="none"
                >
                  <path
                    className="fill-indigo-600 opacity-70"
                    d="M409.9,2.6c-9.7-0.6-19.5-1-29.2-1.5c-3.2-0.2-6.4-0.2-9.7-0.3c-7-0.2-14-0.4-20.9-0.5 c-3.9-0.1-7.8-0.2-11.7-0.3c-1.1,0-2.3,0-3.4,0c-2.5,0-5.1,0-7.6,0c-11.5,0-23,0-34.5,0c-2.7,0-5.5,0.1-8.2,0.1 c-6.8,0.1-13.6,0.2-20.3,0.3c-7.7,0.1-15.3,0.1-23,0.3c-12.4,0.3-24.8,0.6-37.1,0.9c-7.2,0.2-14.3,0.3-21.5,0.6 c-12.3,0.5-24.7,1-37,1.5c-6.7,0.3-13.5,0.5-20.2,0.9C112.7,5.3,99.9,6,87.1,6.7C80.3,7.1,73.5,7.4,66.7,8 C54,9.1,41.3,10.1,28.5,11.2c-2.7,0.2-5.5,0.5-8.2,0.7c-5.5,0.5-11,1.2-16.4,1.8c-0.3,0-0.7,0.1-1,0.1c-0.7,0.2-1.2,0.5-1.7,1 C0.4,15.6,0,16.6,0,17.6c0,1,0.4,2,1.1,2.7c0.7,0.7,1.8,1.2,2.7,1.1c6.6-0.7,13.2-1.5,19.8-2.1c6.1-0.5,12.3-1,18.4-1.6 c6.7-0.6,13.4-1.1,20.1-1.7c2.7-0.2,5.4-0.5,8.1-0.7c10.4-0.6,20.9-1.1,31.3-1.7c6.5-0.4,13-0.7,19.5-1.1c2.7-0.1,5.4-0.3,8.1-0.4 c10.3-0.4,20.7-0.8,31-1.2c6.3-0.2,12.5-0.5,18.8-0.7c2.1-0.1,4.2-0.2,6.3-0.2c11.2-0.3,22.3-0.5,33.5-0.8 c6.2-0.1,12.5-0.3,18.7-0.4c2.2-0.1,4.4-0.1,6.7-0.1c11.5-0.1,23-0.2,34.6-0.4c7.2-0.1,14.4-0.1,21.6-0.1c12.2,0,24.5,0.1,36.7,0.1 c2.4,0,4.8,0.1,7.2,0.2c6.8,0.2,13.5,0.4,20.3,0.6c5.1,0.2,10.1,0.3,15.2,0.4c3.6,0.1,7.2,0.4,10.8,0.6c10.6,0.6,21.1,1.2,31.7,1.8 c2.7,0.2,5.4,0.4,8,0.6c2.9,0.2,5.8,0.4,8.6,0.7c0.4,0.1,0.9,0.2,1.3,0.3c1.1,0.2,2.2,0.2,3.2-0.4c0.9-0.5,1.6-1.5,1.9-2.5 c0.6-2.2-0.7-4.5-2.9-5.2c-1.9-0.5-3.9-0.7-5.9-0.9c-1.4-0.1-2.7-0.3-4.1-0.4c-2.6-0.3-5.2-0.4-7.9-0.6 C419.7,3.1,414.8,2.9,409.9,2.6z"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-400 dark:text-gray-300">
              We bring you not only a stay option, but an experience in your
              budget to enjoy the luxury.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200">
                Discover Now
              </button>
              <Link
                href="https://www.youtube.com/embed/tXHviS-4ygo"
                className="flex items-center gap-3 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition"
              >
                <div className="relative w-12 h-12">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
                <span className="font-medium">Watch our story</span>
              </Link>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-3xl" />
            </div>

            {/* 24/7 Support Badge */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-800 dark:border-gray-700 rounded-2xl p-4 text-center shadow-2xl">
              <div className="w-12 h-12 mx-auto mb-2 bg-red-500/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h5 className="text-white font-bold text-lg">24 / 7</h5>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Guide Supports</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative -mb-16 mt-16 max-w-5xl mx-auto">
          <div className="bg-gray-900 dark:bg-gray-800 shadow-2xl rounded-3xl p-6 border border-gray-800 dark:border-gray-700">
            <h6 className="text-white text-lg font-semibold mb-4">
              Check Availability
            </h6>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-800 dark:bg-gray-700 rounded-lg">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="San Jacinto, USA"
                    className="w-full bg-transparent text-white dark:text-gray-100 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800 dark:bg-gray-700 rounded-lg">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">
                    Check in - out
                  </label>
                  <input
                    type="text"
                    placeholder="04 Oct to 09 Oct"
                    className="w-full bg-transparent text-white dark:text-gray-100 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800 dark:bg-gray-700 rounded-lg">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">
                    Guests & rooms
                  </label>
                  <input
                    type="text"
                    placeholder="2 Adults 1 Room"
                    className="w-full bg-transparent text-white dark:text-gray-100 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-xl transition"
              aria-label="Rechercher des hôtels"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}