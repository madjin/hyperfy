/* global env */
import 'ses'
import '../core/lockdown'
import { createRoot } from 'react-dom/client'

import { resolveConnectionMode } from '../core/resolveConnectionMode'
import { OfflineNetwork } from '../core/systems/OfflineNetwork'
import { Client } from './world-client'

function App() {
  const searchParams = new URLSearchParams(location.search)
  const allowOverride =
    location.hostname === 'localhost' ||
    env.PUBLIC_ALLOW_WS_OVERRIDE === 'true'
  const conn = resolveConnectionMode({
    wsUrl: env.PUBLIC_WS_URL,
    searchParams,
    allowOverride,
  })
  const NetworkSystem = conn.mode !== 'direct' ? OfflineNetwork : undefined
  return <Client wsUrl={conn.wsUrl} networkSystem={NetworkSystem} />
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
