import { IconType } from "react-icons";

export interface PlaceType {
    name: string;
    image: any; // ou StaticImageData pour Next.js
    category: {
        name: string;
        icon: IconType;
    };
    open: boolean;
    recommended?: boolean;
    price?: number;
    address?: string;
    phoneNo?: string;
}

