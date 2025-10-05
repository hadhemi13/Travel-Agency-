export type NotificationType = {
    title: string
    content?: string
    time: string
}

export const notificationData: NotificationType[] = [
    {
        title: 'Nouveau ! Réservez des vols depuis New York ✈️',
        content: 'Trouvez des billets flexibles sur des vols dans le monde entier. Commencez votre recherche aujourd\'hui',
        time: '05 Fév 2024',
    },
    {
        title: 'Les économies d\'été sont là 🌞 économisez 30% ou plus sur un séjour',
        time: '24 Août 2024',
    },
]

