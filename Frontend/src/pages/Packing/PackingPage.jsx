import { useState } from 'react'
import { useParams } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import TripWorkspaceNav from '../../components/TripWorkspaceNav'
import { useTravelApp } from '../../context/TravelAppContext'
import PackingCategoryCard from './components/PackingCategoryCard'
import PackingForm from './components/PackingForm'

function PackingPage() {
  const { tripId } = useParams()
  const { trips, addChecklistItem, toggleChecklistItem, removeChecklistItem, resetChecklist } =
    useTravelApp()
  const trip = trips.find((item) => item.id === tripId)
  const [itemLabel, setItemLabel] = useState('')
  const [itemCategory, setItemCategory] = useState('Clothing')

  if (!trip) {
    return null
  }

  const groupedPacking = ['Clothing', 'Documents', 'Electronics', 'Essentials'].map((category) => ({
    category,
    items: trip.packing.filter((item) => item.category === category),
  }))

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!itemLabel.trim()) {
      return
    }

    addChecklistItem(trip.id, { label: itemLabel, category: itemCategory })
    setItemLabel('')
  }

  return (
    <SiteLayout
      mapQuery={trip.destinationSummary}
      eyebrow="Packing checklist"
      title={`${trip.name} packing list`}
      description="Add what you need, mark it packed, remove old items, and reset the checklist whenever the trip starts fresh."
      actions={
        <button type="button" className="site-button site-button-light" onClick={() => resetChecklist(trip.id)}>
          Reset Checklist
        </button>
      }
    >
      <TripWorkspaceNav tripId={trip.id} />

      <section className="panel-grid panel-grid-2">
        <PackingForm
          itemLabel={itemLabel}
          itemCategory={itemCategory}
          onItemLabelChange={setItemLabel}
          onItemCategoryChange={setItemCategory}
          onSubmit={handleSubmit}
        />

        <div className="stack-list">
          {groupedPacking.map((group) => (
            <PackingCategoryCard
              key={group.category}
              group={group}
              tripId={trip.id}
              onToggleItem={toggleChecklistItem}
              onRemoveItem={removeChecklistItem}
            />
          ))}
        </div>
      </section>
    </SiteLayout>
  )
}

export default PackingPage
