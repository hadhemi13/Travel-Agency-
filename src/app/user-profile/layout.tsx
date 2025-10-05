import { ReactNode } from 'react'
import { TopNavBar } from '@/components/TopNav'
import UserLayout from './components/UserLayout'

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <TopNavBar />
            <UserLayout>{children}</UserLayout>
        </>
    )
}

export default layout
