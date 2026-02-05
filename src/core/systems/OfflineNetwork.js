import { uuid } from '../utils'
import { System } from './System'

/**
 * OfflineNetwork — null object implementing the ClientNetwork surface
 * used by shared systems: id, isClient, isServer, isOffline, send, sendTo,
 * upload, getTime, enqueue, preFixedUpdate, maxUploadSize, apiUrl.
 *
 * Does NOT handle world state bootstrap — that belongs in the client init path.
 */
export class OfflineNetwork extends System {
  constructor(world) {
    super(world)
    this.id = uuid()
    this.isClient = true
    this.isServer = false
    this.isOffline = true
    this.ws = null
    this.apiUrl = null
    this.maxUploadSize = 0
    this.serverTimeOffset = 0
  }

  init() {
    /* no-op: no WebSocket, no state bootstrap */
  }

  send() {
    /* no-op */
  }

  sendTo() {
    /* no-op */
  }

  upload() {
    return Promise.resolve()
  }

  enqueue() {
    /* no-op: no packet source */
  }

  flush() {
    /* no-op */
  }

  getTime() {
    return performance.now() / 1000
  }

  preFixedUpdate() {
    /* no-op: nothing to flush */
  }
}
