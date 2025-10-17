"use client";
import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";

const ActionBox = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    
    setError("");
    console.log("Email submitted:", email);
    // Handle form submission here
  };

  return (
    <section className="pt-0 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gray-100 rounded-3xl relative overflow-hidden p-4 sm:p-8">
          {/* Figure orange */}
          <figure className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
            <svg
              className="fill-orange-500"
              width="250px"
              height="255px"
              viewBox="0 0 300.24 305.85"
            >
              <path d="M72.33,265.03c-41.74-43.54-67.69-97.8-72.24-159.79C-2.45,59.51,47.02,6.52,101.33,1.31 c61.88-6.72,117.52,12.02,155.39,64.52c16.58,23.1,27.89,49.78,35.88,75.54c18.39,55.77,2.61,105.79-37.18,136.4 c-45.06,34.18-108.20,37.69-155.75,7.58C90.6,279.3,82.55,272.11,72.33,265.03z" />
            </svg>
          </figure>

          {/* Figure warning */}
          <figure className="absolute top-full left-full -translate-x-1/2 -translate-y-1/2">
            <svg
              className="fill-yellow-400"
              width="177.91px"
              height="132.35px"
              viewBox="0 0 177.91 132.35"
            >
              <path d="M128.84,69.77c2.74,3.33,2.92,6.79,0.71,10.54c0.77,0,1.31,0,1.79,0c7.56,0,15.12,0.3,22.68,1.13 c4.94,0.54,9.82,1.31,14.52,2.86c1.73,0.54,3.39,1.25,5,2.08c1.07,0.54,2.08,1.37,2.92,2.26c1.85,2.02,1.9,4.7,0.36,6.96 c-0.83,1.25-1.96,2.26-3.21,2.98c-2.2,1.25-4.4,2.44-6.73,3.45c-6.25,2.74-12.74,4.82-19.23,6.79c-7.98,2.44-15.95,4.76-23.93,7.14 c-0.48,0.12-1.01,0.3-1.73,0.54c0.54,0.3,0.89,0.48,1.25,0.65c1.43,0.77,2.44,1.85,2.5,3.51c0.06,1.79-0.83,3.04-2.32,3.81 c-1.19,0.6-2.56,1.13-3.87,1.49c-5.3,1.49-10.71,2.32-16.13,3.15c-10.36,1.55-20.77,2.62-31.25,3.04 c-8.93,0.36-17.8,0.36-26.67-1.01c-3.33-0.54-6.67-1.25-9.76-2.56c-1.67-0.71-3.27-1.55-4.64-2.8c-3.15-2.8-3.87-6.61-1.9-10.36 c1.01-1.9,2.44-3.51,4.05-4.94c3.15-2.8,6.79-4.94,10.48-6.85c0.6-0.3,1.25-0.65,1.85-1.19c-0.36,0-0.71,0-1.01,0 c-6.07,0.3-12.2,0.36-18.27-0.48c-2.74-0.36-5.42-0.95-8.04-2.02c-1.85-0.77-3.63-1.73-5.06-3.15c-2.62-2.62-3.45-5.71-2.5-9.29 c0.54-2.02,1.49-3.81,2.92-5.36c1.67-1.85,3.33-3.69,5.24-5.24c3.15-2.56,6.49-4.82,9.76-7.26c0.48-0.36,0.89-0.65,1.67-1.25 c-0.71-0.06-1.07-0.12-1.49-0.12c-3.57,0-7.14,0.06-10.71-0.12c-1.96-0.06-3.99-0.42-5.95-0.83c-1.19-0.24-2.38-0.71-3.45-1.31 C4.91,64,3.6,60.3,5.15,56.32c0.83-2.14,2.26-3.93,3.87-5.6c0.54-0.6,1.13-1.13,1.85-1.85c-0.48-0.06-0.77-0.12-1.07-0.12 c-1.37-0.06-2.74-0.06-4.11-0.24c-0.95-0.12-1.96-0.42-2.86-0.83c-2.56-1.25-3.51-3.93-2.32-6.49c0.48-1.01,1.19-2.02,1.96-2.74 c1.49-1.31,3.04-2.62,4.76-3.63c3.51-2.02,7.02-3.99,10.71-5.71c5.6-2.44,11.19-4.7,16.73-7.08c0.95-0.42,1.96-0.83,2.86-1.37 c8.04-4.94,16.73-8.51,25.65-11.31c14.64-4.64,29.64-7.62,45-8.93c6.19-0.54,12.38-0.65,18.51,0.18c2.38,0.3,4.7,0.77,6.9,1.79 c1.13,0.54,2.32,1.13,3.27,1.96c2.38,1.96,2.98,5,1.49,7.74c-0.6,1.13-1.37,2.2-2.32,3.04c-1.96,1.79-4.05,3.45-6.25,4.94 c-4.35,2.98-8.99,5.42-13.63,7.8c-0.48,0.24-0.89,0.48-1.37,1.01c0.6,0.06,1.13,0.12,1.73,0.24c1.13,0.24,2.26,0.42,3.33,0.77 c4.11,1.49,4.88,5.48,1.67,8.39c-1.01,0.89-2.2,1.73-3.39,2.38c-2.62,1.43-5.36,2.74-8.04,3.99c-2.38,1.07-4.76,2.08-7.2,3.33 c0.36,0.06,0.77,0.12,1.13,0.12c6.49,0.3,12.92,0.77,19.29,1.9c3.33,0.6,6.67,1.25,9.82,2.56c1.37,0.6,2.8,1.25,3.99,2.14 c3.10,2.32,3.39,5.95,0.83,8.87c-0.83,0.89-1.79,1.73-2.8,2.44c-1.67,1.13-3.45,2.02-5.18,3.04 C129.67,69.29,129.32,69.53,128.84,69.77z" />
            </svg>
          </figure>

          {/* Content */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 justify-between items-center relative">
            <div className="xl:col-span-6">
              <h4 className="text-2xl font-bold mb-0">Subscribe Our Newsletter</h4>
            </div>
            <div className="xl:col-span-5">
              <div className="bg-white rounded-2xl p-2">
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-gray-900 text-white rounded-full p-3 flex-shrink-0 flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    <BsArrowRight className="text-xl" />
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2 px-2">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActionBox;