import hotel2 from "@/assets/images/category/hotel/4by3/02.jpg";
import hotel3 from "@/assets/images/category/hotel/4by3/03.jpg";
import hotel5 from "@/assets/images/category/hotel/4by3/05.jpg";
import { StaticImageData } from "next/image";

type CompareListingType = {
  name: string;
  image: StaticImageData;
  price: number;
};

export const compareListings: CompareListingType[] = [
  {
    name: "Courtyard by Marriott New York",
    image: hotel2,
    price: 750,
  },
  {
    name: "Club Quarters Hotel",
    image: hotel3,
    price: 800,
  },
  {
    name: "Pride moon Village Resort & Spa",
    image: hotel5,
    price: 1000,
  },
];
