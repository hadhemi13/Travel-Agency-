export type WishCardType = {
    id: string
    name: string
    address: string
    image: string
    price: number
    rating: number
    type: 'hotel' | 'tour' | 'flight' | 'cab'
}

export const wishlistData: WishCardType[] = [
    {
        id: '1',
        name: 'Hotel Paradise Resort',
        address: 'Bali, Indonésie',
        image: '/assets/images/hotel1.jpg',
        price: 120,
        rating: 4.5,
        type: 'hotel'
    },
    {
        id: '2',
        name: 'Tour de Paris',
        address: 'Paris, France',
        image: '/assets/images/hotel1.jpg',
        price: 85,
        rating: 4.8,
        type: 'tour'
    },
    {
        id: '3',
        name: 'Vol vers Tokyo',
        address: 'Tokyo, Japon',
        image: '/assets/images/hotel1.jpg',
        price: 450,
        rating: 4.2,
        type: 'flight'
    },
    {
        id: '4',
        name: 'Hotel Marina Bay',
        address: 'Singapour',
        image: '/assets/images/hotel1.jpg',
        price: 200,
        rating: 4.9,
        type: 'hotel'
    },
    {
        id: '5',
        name: 'Tour de Rome',
        address: 'Rome, Italie',
        image: '/assets/images/hotel1.jpg',
        price: 95,
        rating: 4.6,
        type: 'tour'
    },
    {
        id: '6',
        name: 'Vol vers New York',
        address: 'New York, USA',
        image: '/assets/images/hotel1.jpg',
        price: 380,
        rating: 4.3,
        type: 'flight'
    }
]
