import { useAppController } from './orchestration/useAppController'
import AppView from './presentation/AppView'

function App() {
  const controller = useAppController()
  return <AppView {...controller} />
}

export default App
