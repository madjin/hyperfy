import { System } from './System'
import { sanitizeWsUrl } from '../utils'

/**
 * ClientConnection — registers chat slash commands for connection management.
 * Works in both online and offline modes.
 *
 * Commands:
 *   /connect <wsUrl>  — reload with ?connect=<url>
 *   /offline           — reload in offline mode
 *   /reconnect         — reload with clean URL (env default)
 */
export class ClientConnection extends System {
  init() {
    this.world.chat.bindCommand('connect', ({ value }) => {
      const clean = sanitizeWsUrl(value)
      if (!clean) {
        this.world.chat.add({ body: 'Usage: /connect ws://host:port/ws' })
        return
      }
      const url = new URL(window.location.href)
      url.searchParams.delete('mode')
      url.searchParams.set('connect', clean)
      window.location.href = url.toString()
    })

    this.world.chat.bindCommand('offline', () => {
      this.world.network.ws?.close()
    })

    this.world.chat.bindCommand('reconnect', () => {
      const url = new URL(window.location.href)
      url.searchParams.delete('connect')
      url.searchParams.delete('mode')
      window.location.href = url.toString()
    })
  }
}
