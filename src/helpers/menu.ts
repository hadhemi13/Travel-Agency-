export interface MenuItemType {
    key: string
    label: string
    url?: string
    icon?: any
    parentKey?: string
    isTitle?: boolean
    children?: MenuItemType[]
    target?: string
}
