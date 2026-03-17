/* global env */
import 'ses'
import '../core/lockdown'
import { createRoot } from 'react-dom/client'

import { sanitizeWsUrl } from '../core/utils'
import { OfflineNetwork } from '../core/systems/OfflineNetwork'
import { Client } from './world-client'

function App() {
  const searchParams = new URLSearchParams(location.search)
  const allowOverride =
    location.hostname === 'localhost' || env.PUBLIC_ALLOW_WS_OVERRIDE === 'true'

  let wsUrl = env.PUBLIC_WS_URL
  let mode = searchParams.get('mode')

  if (mode !== 'offline' && mode !== 'solo') {
    if (allowOverride) {
      const connectUrl = searchParams.get('connect')
      if (connectUrl) {
        const clean = sanitizeWsUrl(connectUrl)
        if (clean) {
          wsUrl = clean
          mode = 'direct'
        }
      }
    }
    if (!mode) mode = wsUrl ? 'direct' : 'offline'
  }

  const NetworkSystem = mode !== 'direct' ? OfflineNetwork : undefined
  return <Client wsUrl={wsUrl} networkSystem={NetworkSystem} />
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
