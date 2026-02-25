import ContatoHeader from '../components/ContatoHeader'
import VoluntarioCTA from '../components/VoluntarioCTA'
import ContatoDetails from '../components/ContatoDetails'

function Contato() {
  return (
    <div className="min-h-screen">
      <ContatoHeader />
      <VoluntarioCTA />
      <ContatoDetails />
    </div>
  )
}

export default Contato