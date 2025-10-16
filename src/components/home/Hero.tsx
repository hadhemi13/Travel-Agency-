import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/hotels/SearchBar";

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
                    d="M409.9,2.6c-9.7-0.6-19.5-1-29.2-1.5c-3.2-0.2-6.4-0.2-9.7-0.3c-7-0.2-14-0.4-20.9-0.5 
                    c-3.9-0.1-7.8-0.2-11.7-0.3c-1.1,0-2.3,0-3.4,0c-2.5,0-5.1,0-7.6,0c-11.5,0-23,0-34.5,0c-2.7,0-5.5,0.1-8.2,0.1 
                    c-6.8,0.1-13.6,0.2-20.3,0.3c-7.7,0.1-15.3,0.1-23,0.3c-12.4,0.3-24.8,0.6-37.1,0.9c-7.2,0.2-14.3,0.3-21.5,0.6 
                    c-12.3,0.5-24.7,1-37,1.5c-6.7,0.3-13.5,0.5-20.2,0.9C112.7,5.3,99.9,6,87.1,6.7C80.3,7.1,73.5,7.4,66.7,8 
                    C54,9.1,41.3,10.1,28.5,11.2c-2.7,0.2-5.5,0.5-8.2,0.7c-5.5,0.5-11,1.2-16.4,1.8c-0.3,0-0.7,0.1-1,0.1c-0.7,0.2-1.2,0.5-1.7,1 
                    C0.4,15.6,0,16.6,0,17.6c0,1,0.4,2,1.1,2.7c0.7,0.7,1.8,1.2,2.7,1.1c6.6-0.7,13.2-1.5,19.8-2.1c6.1-0.5,12.3-1,18.4-1.6 
                    c6.7-0.6,13.4-1.1,20.1-1.7c2.7-0.2,5.4-0.5,8.1-0.7c10.4-0.6,20.9-1.1,31.3-1.7c6.5-0.4,13-0.7,19.5-1.1
                    c2.7-0.1,5.4-0.3,8.1-0.4c10.3-0.4,20.7-0.8,31-1.2c6.3-0.2,12.5-0.5,18.8-0.7c2.1-0.1,4.2-0.2,6.3-0.2
                    c11.2-0.3,22.3-0.5,33.5-0.8c6.2-0.1,12.5-0.3,18.7-0.4c2.2-0.1,4.4-0.1,6.7-0.1c11.5-0.1,23-0.2,34.6-0.4
                    c7.2-0.1,14.4-0.1,21.6-0.1c12.2,0,24.5,0.1,36.7,0.1c2.4,0,4.8,0.1,7.2,0.2c6.8,0.2,13.5,0.4,20.3,0.6
                    c5.1,0.2,10.1,0.3,15.2,0.4c3.6,0.1,7.2,0.4,10.8,0.6c10.6,0.6,21.1,1.2,31.7,1.8c2.7,0.2,5.4,0.4,8,0.6
                    c2.9,0.2,5.8,0.4,8.6,0.7c0.4,0.1,0.9,0.2,1.3,0.3c1.1,0.2,2.2,0.2,3.2-0.4c0.9-0.5,1.6-1.5,1.9-2.5
                    c0.6-2.2-0.7-4.5-2.9-5.2c-1.9-0.5-3.9-0.7-5.9-0.9c-1.4-0.1-2.7-0.3-4.1-0.4c-2.6-0.3-5.2-0.4-7.9-0.6 
                    C419.7,3.1,414.8,2.9,409.9,2.6z"
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
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}
