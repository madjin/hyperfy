import { System } from './System'

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
      if (!value || !value.startsWith('ws')) {
        this.world.chat.add({ body: 'Usage: /connect ws://host:port/ws' })
        return
      }
      // Sanitize: strip query/fragment to prevent auth token leakage
      try {
        const parsed = new URL(value)
        if (parsed.protocol !== 'ws:' && parsed.protocol !== 'wss:') {
          this.world.chat.add({ body: 'URL must start with ws:// or wss://' })
          return
        }
        const clean = parsed.origin + parsed.pathname
        const url = new URL(window.location.href)
        url.searchParams.delete('mode')
        url.searchParams.set('connect', clean)
        window.location.href = url.toString()
      } catch (_e) {
        this.world.chat.add({ body: 'Invalid URL' })
      }
    })

    this.world.chat.bindCommand('offline', () => {
      const url = new URL(window.location.href)
      url.searchParams.delete('connect')
      url.searchParams.set('mode', 'offline')
      window.location.href = url.toString()
    })

    this.world.chat.bindCommand('reconnect', () => {
      const url = new URL(window.location.href)
      url.searchParams.delete('connect')
      url.searchParams.delete('mode')
      window.location.href = url.toString()
    })
  }
}
