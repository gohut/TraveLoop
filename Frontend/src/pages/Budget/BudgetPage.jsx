import { useParams } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import TripWorkspaceNav from '../../components/TripWorkspaceNav'
import { useTravelApp } from '../../context/TravelAppContext'
import BudgetAlerts from './components/BudgetAlerts'
import BudgetBreakdown from './components/BudgetBreakdown'

function BudgetPage() {
  const { tripId } = useParams()
  const { trips } = useTravelApp()
  const trip = trips.find((item) => item.id === tripId)

  if (!trip) {
    return null
  }

  return (
    <SiteLayout
      mapQuery={trip.destinationSummary}
      eyebrow="Budget and cost"
      title={`${trip.name} budget`}
      description="Track the estimated total cost, review where the money is going, and spot days that exceed the target budget."
    >
      <TripWorkspaceNav tripId={trip.id} />
      <BudgetBreakdown trip={trip} />
      <BudgetAlerts trip={trip} />
    </SiteLayout>
  )
}

export default BudgetPage
