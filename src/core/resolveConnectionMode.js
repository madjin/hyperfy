/**
 * Connection policy resolver — pure function, decoupled from mechanism.
 * Implements JanusWeb-style prioritized fallback chain.
 *
 * Priority: explicit mode flag > URL connect override (gated) > env wsUrl > offline
 *
 * @param {Object} opts
 * @param {string}          [opts.wsUrl]         - Default wsUrl from env/config
 * @param {URLSearchParams} [opts.searchParams]  - URL query parameters
 * @param {string}          [opts.referrer]       - Referrer context from portal (future)
 * @param {boolean}         [opts.allowOverride]  - Whether ?connect= is allowed
 * @returns {{ mode: 'offline' | 'solo' | 'direct', wsUrl?: string }}
 */
export function resolveConnectionMode({
  wsUrl,
  searchParams,
  _referrer,
  allowOverride,
} = {}) {
  const mode = searchParams?.get('mode')

  // 1. Explicit mode flag
  if (mode === 'offline') return { mode: 'offline' }
  if (mode === 'solo') return { mode: 'solo' } // placeholder for future

  // 2. URL query connect override (gated)
  if (allowOverride) {
    const connectUrl = searchParams?.get('connect')
    if (connectUrl && connectUrl.startsWith('ws')) {
      // Sanitize: parse with URL constructor, reject query/fragment injection
      try {
        const parsed = new URL(connectUrl)
        if (parsed.protocol !== 'ws:' && parsed.protocol !== 'wss:') {
          throw new Error('invalid protocol')
        }
        // Rebuild clean URL: origin + pathname only (strip query/fragment)
        const clean = parsed.origin + parsed.pathname
        return { mode: 'direct', wsUrl: clean }
      } catch (_e) {
        // Malformed URL — ignore override, fall through
      }
    }
  }

  // 3. Referrer hint from portal (future — reserved input, no behavior yet)
  // if (referrer) { ... }

  // 4. Environment/config wsUrl
  if (wsUrl) return { mode: 'direct', wsUrl }

  // 5. No wsUrl → offline
  return { mode: 'offline' }
}
