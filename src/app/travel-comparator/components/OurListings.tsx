'use client'
import { useState } from 'react'
import { FaPlus, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

// Mock data
const currency = '$'
const compareListings = [
  {
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    name: 'Luxury Villa in Beverly Hills',
    price: '5,500'
  },
  {
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
    name: 'Modern Downtown Apartment',
    price: '3,200'
  },
  {
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop',
    name: 'Cozy Suburban Home',
    price: '2,800'
  }
]

const OurListings = () => {
  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="align-top">
                  <tr>
                    <th scope="col" className="p-4 text-left">
                      <p className="text-3xl font-bold mb-4">Compare Our Listing</p>
                      <button className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full mb-0">
                        <FaPlus />
                      </button>
                    </th>
                    {compareListings.map((item, idx) => {
                      return (
                        <th scope="col" key={idx} className="p-4 min-w-[280px]">
                          <div className="bg-transparent">
                            <img
                              src={item.image}
                              className="rounded w-full h-48 object-cover"
                              alt="..."
                            />
                            <div className="px-0 py-4">
                              <span className="text-xl font-semibold">
                                <a href="#" className="hover:text-blue-600">{item.name}</a>
                              </span>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
                                <span className="text-xl font-semibold text-green-600 mb-0">
                                  {currency}
                                  {item.price}
                                </span>
                                <a
                                  href="#"
                                  className="text-sm text-blue-600 hover:text-blue-800 mb-0 p-0 inline-flex items-center"
                                >
                                  View Listing
                                  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                  </svg>
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
                  <tr className="border-t border-gray-200">
                    <th scope="row" className="p-4 text-left font-semibold">
                      <span className="text-xl mb-0">Rating</span>
                    </th>
                    <td className="p-4">
                      <ul className="flex mb-0 list-none p-0">
                        {Array.from(new Array(4)).map((_val, idx) => (
                          <li className="mr-1" key={idx}>
                            <FaStar size={16} className="text-yellow-400" />
                          </li>
                        ))}
                        <li>
                          <FaRegStar size={16} className="text-yellow-400" />
                        </li>
                      </ul>
                    </td>
                    <td className="p-4">
                      <ul className="flex mb-0 list-none p-0">
                        {Array.from(new Array(4)).map((_val, idx) => (
                          <li className="mr-1" key={idx}>
                            <FaStar size={16} className="text-yellow-400" />
                          </li>
                        ))}
                        <li>
                          <FaStarHalfAlt size={15} className="text-yellow-400" />
                        </li>
                      </ul>
                    </td>
                    <td className="p-4">
                      <ul className="flex mb-0 list-none p-0">
                        {Array.from(new Array(5)).map((_val, idx) => (
                          <li className="mr-1" key={idx}>
                            <FaStar size={16} className="text-yellow-400" />
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <th scope="row" className="p-4 text-left font-semibold">
                      <span className="text-xl mb-0">Floor area</span>
                    </th>
                    <td className="p-4">1700 sq.ft</td>
                    <td className="p-4">1500 sq.ft</td>
                    <td className="p-4">1650 sq.ft</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <th scope="row" className="p-4 text-left font-semibold">
                      <span className="text-xl mb-0">Bedroom</span>
                    </th>
                    <td className="p-4">3 Bedroom 4 Beds</td>
                    <td className="p-4">2 Bedroom 3 Beds</td>
                    <td className="p-4">1 Bedroom 2 Beds</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <th scope="row" className="p-4 text-left font-semibold">
                      <span className="text-xl mb-0">Bathroom</span>
                    </th>
                    <td className="p-4">2 Showers</td>
                    <td className="p-4">2 Showers 1 Bathtub</td>
                    <td className="p-4">1 Shower 1 Bathtub</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <th scope="row" className="p-4 text-left font-semibold">
                      <span className="text-xl mb-0">Swimming Pool</span>
                    </th>
                    <td className="p-4">
                      <span className="text-3xl text-green-600 mb-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-3xl text-red-600 mb-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-3xl text-red-600 mb-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <th scope="row" className="p-4 text-left font-semibold">
                      <span className="text-xl mb-0">Air conditioning</span>
                    </th>
                    <td className="p-4">
                      <span className="text-3xl text-green-600 mb-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-3xl text-green-600 mb-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-3xl text-green-600 mb-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <th scope="row" className="p-4 text-left font-semibold">
                      <span className="text-xl mb-0">Gym</span>
                    </th>
                    <td className="p-4">
                      <span className="text-3xl text-red-600 mb-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-3xl text-red-600 mb-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-3xl text-green-600 mb-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <th scope="row" className="p-4 text-left font-semibold">
                      <span className="text-xl mb-0">Internet</span>
                    </th>
                    <td className="p-4">
                      <span className="text-3xl text-green-600 mb-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-3xl text-green-600 mb-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-3xl text-green-600 mb-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <th scope="row" className="p-4 text-left font-semibold">
                      <span className="text-xl mb-0">Actions</span>
                    </th>
                    <td className="p-4">
                      <button className="px-4 py-2 text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 rounded mb-0">
                        Remove
                      </button>
                    </td>
                    <td className="p-4">
                      <button className="px-4 py-2 text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 rounded mb-0">
                        Remove
                      </button>
                    </td>
                    <td className="p-4">
                      <button className="px-4 py-2 text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 rounded mb-0">
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