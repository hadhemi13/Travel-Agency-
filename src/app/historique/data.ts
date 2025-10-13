import { StaticImageData } from "next/image";

export type TourHistoryType = {
    id: number;
    name: string;
    bookingDate: string;
    travelDate: string;
    status: 'completed' | 'upcoming' | 'cancelled';
    type: string;
    days: number;
    nights: number;
    benefits: {
        flight?: number;
        hotel?: number;
        activities?: number;
    };
    price: number;
    image: string;
    bookingReference: string;
};

const tourHistory: TourHistoryType[] = [
    {
        id: 1,
        name: "Beautiful Bali with Malaysia",
        type: "Adventure",
        status: "completed",
        days: 6,
        nights: 5,
        bookingDate: "March 15, 2024",
        travelDate: "April 12-17, 2024",
        price: 1500,
        bookingReference: "TH2024001",
        benefits: {
            flight: 2,
            hotel: 3,
            activities: 5,
        },
        image: "/assets/images/category/tour/4by3/04.jpg",
    },
    {
        id: 2,
        name: "Meeru Island Resort Paradise",
        type: "Honeymoon",
        status: "completed",
        days: 6,
        nights: 5,
        bookingDate: "February 10, 2024",
        travelDate: "March 18-23, 2024",
        price: 2200,
        bookingReference: "TH2024002",
        benefits: {
            flight: 2,
            hotel: 1,
            activities: 3,
        },
        image: "/assets/images/category/tour/4by3/05.jpg",
    },
    {
        id: 3,
        name: "Sun Siyam Iru Veli Beach Vacation",
        type: "Beach",
        status: "upcoming",
        days: 5,
        nights: 4,
        bookingDate: "April 20, 2024",
        travelDate: "June 15-19, 2024",
        price: 1850,
        bookingReference: "TH2024003",
        benefits: {
            flight: 2,
            hotel: 1,
            activities: 4,
        },
        image: "/assets/images/category/tour/4by3/06.jpg",
    },
    {
        id: 4,
        name: "Lux South Ari Atoll Experience",
        type: "Nature",
        status: "completed",
        days: 4,
        nights: 3,
        bookingDate: "January 08, 2024",
        travelDate: "February 22-25, 2024",
        price: 980,
        bookingReference: "TH2024004",
        benefits: {
            hotel: 1,
            activities: 3,
            flight: 2,
        },
        image: "/assets/images/category/tour/4by3/07.jpg",
    },
    {
        id: 5,
        name: "Romantic Seaside - Bentota and Colombo Special",
        type: "Adventure",
        status: "cancelled",
        days: 5,
        nights: 4,
        bookingDate: "March 01, 2024",
        travelDate: "May 02-06, 2024",
        price: 1400,
        bookingReference: "TH2024005",
        benefits: {
            hotel: 2,
            flight: 2,
            activities: 6,
        },
        image: "/assets/images/category/tour/4by3/08.jpg",
    },
    {
        id: 6,
        name: "Colombo Vacay - Exotic Beaches of Sri Lanka",
        type: "Heritage",
        status: "completed",
        days: 6,
        nights: 7,
        bookingDate: "December 20, 2023",
        travelDate: "January 15-21, 2024",
        price: 1650,
        bookingReference: "TH2024006",
        benefits: {
            hotel: 2,
            flight: 2,
            activities: 4,
        },
        image: "/assets/images/category/tour/4by3/09.jpg",
    },
    {
        id: 7,
        name: "Dubai Desert Safari Adventure",
        type: "Desert",
        status: "upcoming",
        days: 7,
        nights: 6,
        bookingDate: "April 25, 2024",
        travelDate: "July 10-16, 2024",
        price: 2500,
        bookingReference: "TH2024007",
        benefits: {
            hotel: 2,
            flight: 2,
            activities: 8,
        },
        image: "/assets/images/category/tour/4by3/04.jpg",
    },
    {
        id: 8,
        name: "Swiss Alps Mountain Escape",
        type: "Nature",
        status: "completed",
        days: 8,
        nights: 7,
        bookingDate: "November 15, 2023",
        travelDate: "December 20-27, 2023",
        price: 3200,
        bookingReference: "TH2024008",
        benefits: {
            hotel: 3,
            flight: 2,
            activities: 5,
        },
        image: "/assets/images/category/tour/4by3/05.jpg",
    },
];

export { tourHistory };

