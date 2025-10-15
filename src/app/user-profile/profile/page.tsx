import PersonalInformation from './components/PersonalInformation'
import ProfileProgress from './components/ProfileProgress'
import UpdateEmail from './components/UpdateEmail'
import UpdatePassword from './components/UpdatePassword'

const Profile = () => {
    return (
        <div className="space-y-6">
            <ProfileProgress />
            <PersonalInformation />
            <UpdateEmail />
            <UpdatePassword />
        </div>
    )
}

export default Profile
