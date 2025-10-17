"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TopNavBar from "@/components/TopNav/TopNavBar";
import Footer from "@/components/Footer";
import {
  BsStarFill,
  BsGeoAlt,
  BsWifi,
  BsCalendar,
  BsPeople,
  BsCamera,
  BsHouseDoor,
  BsGlobe,
  BsCheckCircle,
  BsInfoCircle,
  BsDoorOpen,
} from "react-icons/bs";
// import router from "next/router";
import { useRouter } from "next/navigation";

// Updated Type definitions for hotel details based on the API response structure
interface PriceAmount {
  value: number;
  currency: string;
  amount_rounded: string;
  amount_unrounded: string;
}

interface PriceBreakdown {
  net_amount: PriceAmount;
  discounted_amount: PriceAmount;
  charges_details: {
    amount: PriceAmount;
    mode: string;
    translated_copy: string;
  };
  excluded_amount: PriceAmount;
  included_taxes_and_charges_amount: PriceAmount;
  gross_amount: PriceAmount;
  gross_amount_per_night: PriceAmount;
  all_inclusive_amount: PriceAmount;
  strikethrough_amount: PriceAmount;
  strikethrough_amount_per_night: PriceAmount;
  gross_amount_hotel_currency: PriceAmount;
  all_inclusive_amount_hotel_currency: PriceAmount;
  benefits: Array<{
    name: string;
    kind: string;
    badge_variant: string;
    details: string;
    identifier: string;
    icon: string | null;
  }>;
  items: Array<{
    name: string;
    kind: string;
    inclusion_type: string;
    details: string | null;
    item_amount: PriceAmount;
    base: { kind: string; percentage?: number; base_amount?: number };
  }>;
}

interface Facility {
  name: string;
  icon: string;
}

interface RoomPhoto {
  url_original: string;
  url_max750: string;
  url_640x200: string;
  url_max1280: string;
  url_square60: string;
  url_square180: string;
  url_max300: string;
  ratio: number;
  last_update_date: string;
  photo_id: number;
}

interface RoomHighlight {
  translated_name: string;
  id?: number;
  icon: string;
}

interface BedType {
  bed_type: number;
  name: string;
  count: number;
  description: string;
  name_with_count: string;
  description_localized: string | null;
  description_imperial: string;
}

interface BedConfiguration {
  bed_types: BedType[];
}

interface RoomFacility {
  id: number;
  name: string;
  facilitytype_id: number;
  alt_facilitytype_id: number;
  alt_facilitytype_name: string;
}

interface ChildrenAndBeds {
  allow_children: number;
  children_at_the_property: Array<{ text: string; highlight: number }>;
  cribs_and_extra_beds: Array<{ text: string; highlight: number }>;
  age_intervals: Array<{
    min_age: number;
    max_age: number;
    group_by_price: Record<string, string[]>;
    types_by_price: string[][];
    crib?: {
      price_mode_n: number;
      price_type: string;
      guaranteed: number;
      id: number;
      price: string;
      price_mode: string;
      price_type_n: number;
    };
    extra_bed?: {
      price: string;
      price_type_n: number;
      price_mode: string;
      id: number;
      price_type: string;
      price_mode_n: number;
    };
  }>;
}

interface Room {
  private_bathroom_count: number;
  description: string;
  photos: RoomPhoto[];
  highlights: RoomHighlight[];
  bed_configurations: BedConfiguration[];
  cribs_extra_beds: {
    extra_beds: {
      max_count: number;
      ages: number[];
      all_free: number;
    };
  };
  private_bathroom_highlight: { has_highlight: number };
  facilities: RoomFacility[];
  children_and_beds_text: ChildrenAndBeds;
}

interface Block {
  pod_ios_migrate_policies_to_smp_fullon: number;
  can_reserve_free_parking: number;
  fit_status: number;
  number_of_bedrooms: number;
  bh_room_highlights: any[];
  refundable: number;
  babycots_available: number;
  is_smart_deal: number;
  full_board: number;
  roomtype_id: number;
  package_id: number;
  all_inclusive: number;
  max_children_free_age: number;
  nr_adults: number;
  is_block_fit: string;
  half_board: number;
  paymentterms: {
    cancellation: {
      description: string;
      info: any;
      bucket: string;
      non_refundable_anymore: number;
      guaranteed_non_refundable: number;
      type_translation: string;
      type: string;
    };
    prepayment: {
      info: any;
      extended_type_translation: string;
      description: string;
      simple_translation: string;
      type_extended: string;
      type: string;
      type_translation: string;
    };
  };
  deposit_required: number;
  breakfast_included: number;
  pay_in_advance: number;
  room_id: number;
  genius_discount_percentage: number;
  is_domestic_rate: number;
  name_without_policy: string;
  smoking: number;
  block_id: string;
  room_count: number;
  is_flash_deal: number;
  refundable_until: string;
  name: string;
  extrabed_available_amount: number | null;
  number_of_bathrooms: number;
  is_genius_deal: number | null;
  room_surface_in_feet2: number;
  nr_children: number;
  room_name: string;
  must_reserve_free_parking: number;
  fit_occupancy: {
    children_ages: any[];
    nr_adults: number;
  };
  is_last_minute_deal: number;
  children_ages: any[];
  max_children_free: number;
  mealplan: string;
  room_surface_in_m2: number;
  babycots_available_amount: number | null;
  is_vp2_enrolled: number;
  extrabed_available: number;
  max_occupancy: string;
  block_text: {
    policies: Array<{ class: string; content: string }>;
  };
}

interface HotelDetails {
  hotel_name: string;
  hotel_name_trans?: string;
  address: string;
  city: string;
  review_nr: number;
  review_score?: number;
  review_score_word?: string;
  url?: string;
  photos?: RoomPhoto[]; // Hotel-level photos
  property_highlight_strip?: Array<{ name: string }>;
  family_facilities?: string[];
  composite_price_breakdown?: PriceBreakdown;
  rooms?: Record<string, Room>;
  block?: Block[];
  accommodation_type_name?: string;
  hotel_include_breakfast?: 0 | 1;
  soldout?: 0 | 1;
  available_rooms?: number;
  city_trans?: string;
  facilities_block?: {
    name: string;
    facilities: Facility[];
    type: string;
  };
  top_ufi_benefits?: Array<{ translated_name: string; icon: string }>;
  languages_spoken?: { languagecode: string[] };
  spoken_languages?: string[];
  breakfast_review_score?: {
    review_snippet: string;
    review_number: number;
    review_count: number;
    rating: number;
    review_score: number;
    review_score_word: string;
  };
  wifi_review_score?: { rating: number };
  booking_home?: {
    checkin_methods: any[];
    is_aparthotel: number;
    segment: number;
    is_single_type_property: number;
    is_single_unit_property: number;
    is_booking_home: number;
    quality_class: number;
    house_rules: Array<{
      title: string;
      description: string;
      type: string;
      icon: string;
    }>;
    is_vacation_rental: number;
    group: string;
  };
  hotel_important_information_with_codes?: Array<{
    sentence_id?: number;
    phrase: string;
    executing_phase: number;
    is_license?: number;
  }>;
  rawData?: {
    reviewCount: number;
    rankingPosition: number;
    wishlistName: string;
    checkinDate: string;
    reviewScore: number;
    photoUrls: string[];
    name: string;
    qualityClass: number;
    optOutFromGalleryChanges: number;
    checkin: { untilTime: string; fromTime: string };
    propertyClass: number;
    mainPhotoId: number;
    checkoutDate: string;
    longitude: number;
    isPreferredPlus: boolean;
    id: number;
    latitude: number;
    currency: string;
    priceBreakdown: {
      taxExceptions: any[];
      benefitBadges: Array<{ explanation: string; identifier: string; aspect_ratio: string; text: string }>;
      strikethroughPrice: { currency: string; amountRounded: string; value: number };
      grossPrice: { currency: string; amountRounded: string; value: number };
      chargesInfo: string;
    };
    countryCode: string;
    reviewScoreWord: string;
    checkout: { fromTime: string; untilTime: string };
    isPreferred: boolean;
    accuratePropertyClass: number;
    ufi: number;
    isHighlightedHotel: boolean;
    blockIds: string[];
    position: number;
    isFirstPage: boolean;
  };
}

export default function HotelDetail() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const checkIn = searchParams.get("checkIn") || today;
  const checkOut = searchParams.get("checkOut") || tomorrow;
  const adults = searchParams.get("adults") || "1";
  const rooms = searchParams.get("rooms") || "1";



  useEffect(() => {
    async function fetchHotelDetails() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/hotels/details?hotelId=${id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&rooms=${rooms}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch");
        setHotel(data.details);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHotelDetails();
  }, [id, checkIn, checkOut, adults, rooms]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Loading hotel details...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500 text-xl">
        Error: {error}
      </div>
    );
  if (!hotel)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        No hotel found.
      </div>
    );

  // Extract prices from composite_price_breakdown
  const totalPrice = hotel.composite_price_breakdown?.gross_amount?.value || hotel.rawData?.priceBreakdown?.grossPrice?.value || 0;
  const currency = hotel.composite_price_breakdown?.gross_amount?.currency || hotel.rawData?.priceBreakdown?.grossPrice?.currency || "USD";
  const taxes = hotel.composite_price_breakdown?.included_taxes_and_charges_amount?.value || 0;
  const discountedAmount = hotel.composite_price_breakdown?.discounted_amount?.value || 0;
  const strikethroughAmount = hotel.composite_price_breakdown?.strikethrough_amount?.value || 0;
  const netAmount = hotel.composite_price_breakdown?.net_amount?.value || 0;

  // Combine all available photos
  const allPhotos = [
    ...(hotel.photos || []),
    ...(hotel.rooms ? Object.values(hotel.rooms).flatMap((room) => room.photos || []) : []),
    ...(hotel.rawData?.photoUrls?.map((url) => ({ url_original: url, url_max1280: url })) || []),
  ].filter((photo) => photo.url_original);

  // Rooms: Combine block and rooms data
  const roomBlocks = hotel.block || [];
  const roomDetails = hotel.rooms || {};


  const router = useRouter();


  const handleReservation = () => {
    // Stocker les données complètes de l'hôtel dans sessionStorage
    const reservationData = {
      hotel: {
        id: id,
        name: hotel.hotel_name,
        name_trans: hotel.hotel_name_trans,
        address: hotel.address,
        city: hotel.city,
        city_trans: hotel.city_trans,
        review_score: hotel.review_score || hotel.rawData?.reviewScore,
        review_score_word: hotel.review_score_word,
        review_nr: hotel.review_nr || hotel.rawData?.reviewCount,
        accommodation_type: hotel.accommodation_type_name,
        photos: allPhotos.slice(0, 10), // Limiter le nombre de photos
        facilities: hotel.facilities_block?.facilities || [],
        languages: hotel.spoken_languages || hotel.languages_spoken?.languagecode || [],
      },
      rooms: roomBlocks.map((blk) => {
        const room = roomDetails[blk.room_id.toString()];
        return {
          block_id: blk.block_id,
          name: blk.name || blk.room_name,
          description: room?.description,
          max_occupancy: blk.max_occupancy,
          room_surface_m2: blk.room_surface_in_m2,
          room_surface_feet2: blk.room_surface_in_feet2,
          mealplan: blk.mealplan,
          breakfast_included: blk.breakfast_included,
          refundable: blk.refundable,
          photos: room?.photos?.slice(0, 3) || [], // 3 premières photos par room
          highlights: room?.highlights || [],
          bed_configurations: room?.bed_configurations || [],
          facilities: room?.facilities || [],
        };
      }),
      pricing: {
        totalPrice,
        currency,
        taxes,
        discountedAmount,
        strikethroughAmount,
        netAmount,
      },
      booking: {
        checkIn,
        checkOut,
        adults,
        rooms,
      },
    };

    sessionStorage.setItem('reservationData', JSON.stringify(reservationData));

    router.push(
        `/reservation?hotelId=${id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&rooms=${rooms}`
    );
  };

  return (
    <>
      <TopNavBar />
      <main className="mt-12 py-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {hotel.hotel_name} {hotel.hotel_name_trans && `(${hotel.hotel_name_trans})`}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center">
                  <BsGeoAlt className="mr-2 text-blue-600 dark:text-blue-400" /> {hotel.address}, {hotel.city} {hotel.city_trans && `(${hotel.city_trans})`}
                </p>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-500 dark:bg-yellow-600 text-white text-sm font-semibold rounded-full">
                    <BsStarFill className="mr-1" /> {hotel.review_score || hotel.rawData?.reviewScore || "N/A"}/10 {hotel.review_score_word && `(${hotel.review_score_word})`}
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    ({hotel.review_nr || hotel.rawData?.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <BsCalendar className="mr-2" /> {checkIn} - {checkOut}
                </div>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <BsPeople className="mr-2" /> {adults} adults, {rooms} rooms
                </div>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <BsWifi className="mr-2" /> WiFi Rating: {hotel.wifi_review_score?.rating || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <BsCamera className="mr-2" /> Hotel Photos
            </h2>
            {allPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo.url_max1280 || photo.url_original}
                    alt={`Photo ${idx + 1}`}
                    className="rounded-xl h-48 w-full object-cover shadow-sm hover:shadow-lg transition dark:shadow-gray-700 dark:hover:shadow-gray-600"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No photos available.</p>
            )}
          </div>

          {/* About */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <BsInfoCircle className="mr-2" /> About This Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {hotel.accommodation_type_name || "Hotel/Apartment"} in {hotel.city_trans || hotel.city}. 
              {hotel.hotel_include_breakfast ? " Breakfast included." : " Breakfast not included."}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Available rooms: {hotel.available_rooms || hotel.block?.length || "N/A"} | Sold out: {hotel.soldout ? "Yes" : "No"}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Quality Class: {hotel.booking_home?.quality_class || hotel.rawData?.qualityClass || "N/A"} | Property Class: {hotel.rawData?.propertyClass || "N/A"} | Accurate Class: {hotel.rawData?.accuratePropertyClass || "N/A"}
            </p>
            <a
              href={hotel.url || `https://www.booking.com/hotel/${hotel.rawData?.countryCode}/${hotel.hotel_name.toLowerCase().replace(/\s/g, "-")}.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
            >
              View on Booking.com
            </a>
          </div>

          {/* Highlights / Facilities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <BsCheckCircle className="mr-2" /> Highlights & Facilities
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.property_highlight_strip?.map((h, idx) => (
                <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {h.name}
                </span>
              )) || hotel.top_ufi_benefits?.map((b, idx) => (
                <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <BsCheckCircle className="mr-1" /> {b.translated_name}
                </span>
              )) || <p className="text-gray-500 dark:text-gray-400">No highlights available.</p>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.facilities_block?.facilities?.map((f, idx) => (
                <div key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                  <BsCheckCircle className="mr-2 text-green-600 dark:text-green-400" /> {f.name}
                </div>
              )) || <p className="text-gray-500 dark:text-gray-400 col-span-full">No facilities listed.</p>}
            </div>
            {hotel.family_facilities?.length ? (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Family Facilities</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  {hotel.family_facilities.map((fac, idx) => <li key={idx}>{fac}</li>)}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Languages Spoken */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <BsGlobe className="mr-2" /> Languages Spoken
            </h2>
            <div className="flex flex-wrap gap-2">
              {hotel.spoken_languages?.map((lang, idx) => (
                <span key={idx} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                  {lang.toUpperCase()}
                </span>
              )) || hotel.languages_spoken?.languagecode?.map((lang, idx) => (
                <span key={idx} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                  {lang.toUpperCase()}
                </span>
              )) || <p className="text-gray-500 dark:text-gray-400">No language information available.</p>}
            </div>
          </div>

          {/* House Rules */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <BsHouseDoor className="mr-2" /> House Rules & Important Information
            </h2>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              {hotel.booking_home?.house_rules?.map((rule, idx) => (
                <li key={idx} className="flex items-start">
                  <BsInfoCircle className="mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong>{rule.title}:</strong> {rule.description}
                  </div>
                </li>
              ))}
              {hotel.hotel_important_information_with_codes?.map((info, idx) => (
                <li key={idx} className="flex items-start">
                  <BsInfoCircle className="mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div dangerouslySetInnerHTML={{ __html: info.phrase }} />
                </li>
              )) || <p className="text-gray-500 dark:text-gray-400">No house rules available.</p>}
            </ul>
          </div>

          {/* Available Rooms */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <BsDoorOpen className="mr-2" /> Available Rooms
            </h2>
            {roomBlocks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roomBlocks.map((blk, idx) => {
                  const room = roomDetails[blk.room_id.toString()];
                  return (
                    <div
                      key={blk.block_id || idx}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow dark:hover:shadow-gray-700"
                    >
                      <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">{blk.name || blk.room_name || "Room"}</h3>
                      {room?.photos?.[0]?.url_original && (
                        <img
                          src={room.photos[0].url_max1280 || room.photos[0].url_original}
                          alt={blk.name}
                          className="rounded-lg mb-3 h-40 w-full object-cover dark:shadow-gray-700"
                          loading="lazy"
                        />
                      )}
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{room?.description || "No description available."}</p>
                      <div className="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Max Occupancy:</strong> {blk.max_occupancy}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Area:</strong> {blk.room_surface_in_m2} m² ({blk.room_surface_in_feet2} ft²)
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Meal Plan:</strong> {blk.mealplan}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Breakfast Included:</strong> {blk.breakfast_included ? "Yes" : "No"}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Refundable:</strong> {blk.refundable ? "Yes" : "No"}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Highlights:</strong>
                        <ul className="list-disc pl-4">
                          {room?.highlights?.map((h, hIdx) => (
                            <li key={hIdx} className="text-gray-700 dark:text-gray-300">{h.translated_name}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Bed Configurations:</strong>
                        <ul className="list-disc pl-4">
                          {room?.bed_configurations?.map((config, cIdx) => (
                            <li key={cIdx} className="text-gray-700 dark:text-gray-300">
                              {config.bed_types.map((bed) => bed.name_with_count).join(", ")}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button className="mt-4 w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition" onClick={handleReservation}>
                        Select Room
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No room data available.</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Price Breakdown</h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Net Amount:</span>
                <span className="font-semibold">{netAmount.toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Discounted Amount:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">-{discountedAmount.toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges:</span>
                <span className="font-semibold">+{taxes.toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Strikethrough Amount (Original):</span>
                <span className="font-semibold line-through text-red-600 dark:text-red-400">{strikethroughAmount.toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-blue-600 dark:text-blue-400">
                <span>Total Gross Amount:</span>
                <span>{totalPrice.toFixed(2)} {currency}</span>
              </div>
            </div>
            {hotel.composite_price_breakdown?.benefits?.length ? (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Benefits & Discounts</h3>
                <ul className="space-y-2">
                  {hotel.composite_price_breakdown.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                      <BsCheckCircle className="mr-2 text-green-600 dark:text-green-400 mt-1" />
                      <div>
                        <strong>{benefit.name} ({benefit.identifier}):</strong> {benefit.details}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {hotel.composite_price_breakdown?.items?.length ? (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Detailed Charges</h3>
                <ul className="space-y-2">
                  {hotel.composite_price_breakdown.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{item.name} ({item.kind}):</span>
                      <span>{item.item_amount.value.toFixed(2)} {item.item_amount.currency}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}