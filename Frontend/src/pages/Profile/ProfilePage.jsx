import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import { useTravelApp } from '../../context/TravelAppContext'
import ProfileSettingsForm from './components/ProfileSettingsForm'
import SavedDestinationsPanel from './components/SavedDestinationsPanel'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, savedDestinations, updateProfile, deleteAccount, toggleSavedDestination } =
    useTravelApp()
  const [profileForm, setProfileForm] = useState(user)

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setProfileForm((currentState) => ({
        ...currentState,
        photo: reader.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (event) => {
    event.preventDefault()
    updateProfile(profileForm)
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    navigate('/login')
  }

  return (
    <SiteLayout
      mapQuery="Global travel preferences map"
      eyebrow="Profile and settings"
      title="Your travel profile"
      description="Update identity, control preferences, manage saved destinations, and reset the account if needed."
    >
      <section className="panel-grid panel-grid-2">
        <ProfileSettingsForm
          profileForm={profileForm}
          setProfileForm={setProfileForm}
          onImageUpload={handleImageUpload}
          onSave={handleSave}
          onDeleteAccount={handleDeleteAccount}
        />
        <SavedDestinationsPanel
          savedDestinations={savedDestinations}
          onToggleDestination={toggleSavedDestination}
        />
      </section>
    </SiteLayout>
  )
}

export default ProfilePage
