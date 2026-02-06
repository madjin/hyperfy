import { css } from '@firebolt-dev/css'
import { useState } from 'react'
import { cls } from './cls'

export function ConnectionBadge({ world, forceExpanded }) {
  const isOffline = !!world.network.isOffline
  const networkId = world.network.id || ''
  const params = new URLSearchParams(location.search)
  const currentConnect = params.get('connect') || ''
  const [expanded, setExpanded] = useState(!!forceExpanded)
  const [serverUrl, setServerUrl] = useState(currentConnect)

  const handleConnect = () => {
    if (!serverUrl || !serverUrl.startsWith('ws')) return
    const url = new URL(location.href)
    url.searchParams.delete('mode')
    url.searchParams.set('connect', serverUrl)
    location.href = url.toString()
  }

  const handleOffline = () => {
    const url = new URL(location.href)
    url.searchParams.delete('connect')
    url.searchParams.set('mode', 'offline')
    location.href = url.toString()
  }

  const handleReset = () => {
    const url = new URL(location.href)
    url.searchParams.delete('connect')
    url.searchParams.delete('mode')
    location.href = url.toString()
  }

  return (
    <div
      className='connbadge'
      css={css`
        position: absolute;
        bottom: calc(2rem + env(safe-area-inset-bottom));
        right: calc(2rem + env(safe-area-inset-right));
        z-index: 2;
        pointer-events: auto;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        @media all and (max-width: 1200px) {
          bottom: calc(1rem + env(safe-area-inset-bottom));
          right: calc(1rem + env(safe-area-inset-right));
        }
        .connbadge-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.15s ease;
          &:hover {
            transform: scale(1.4);
          }
          &.online {
            background: #4ade80;
            box-shadow: 0 0 4px rgba(74, 222, 128, 0.6);
          }
          &.offline {
            background: #6b7280;
          }
        }
        .connbadge-panel {
          margin-bottom: 0.5rem;
          background: rgba(11, 10, 21, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.375rem;
          width: 18rem;
          padding: 0.6rem 0;
        }
        .connbadge-field {
          display: flex;
          align-items: center;
          height: 2.5rem;
          padding: 0 1rem;
          .connbadge-field-label {
            width: 5rem;
            flex-shrink: 0;
            font-size: 0.9375rem;
            color: rgba(255, 255, 255, 0.6);
          }
          .connbadge-field-value {
            flex: 1;
            font-size: 0.9375rem;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          input {
            width: 100%;
            font-size: 0.9375rem;
            text-align: right;
            &::placeholder {
              color: rgba(255, 255, 255, 0.3);
            }
            &::selection {
              background-color: white;
              color: rgba(0, 0, 0, 0.8);
            }
          }
          &:hover {
            background: rgba(255, 255, 255, 0.03);
          }
        }
        .connbadge-sep {
          height: 0.0625rem;
          background: rgba(255, 255, 255, 0.05);
          margin: 0.4rem 0;
        }
        .connbadge-btn {
          display: flex;
          align-items: center;
          height: 2.5rem;
          padding: 0 1rem;
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          &:hover {
            background: rgba(255, 255, 255, 0.03);
            color: rgba(255, 255, 255, 0.9);
          }
          &.highlight {
            color: #4ade80;
            &:hover {
              color: #6ee7a0;
            }
          }
        }
      `}
    >
      {expanded && (
        <div className='connbadge-panel'>
          <div className='connbadge-field'>
            <div className='connbadge-field-label'>Status</div>
            <div className='connbadge-field-value'>{isOffline ? 'Offline' : 'Online'}</div>
          </div>
          <div className='connbadge-field'>
            <div className='connbadge-field-label'>ID</div>
            <div className='connbadge-field-value'>{networkId}</div>
          </div>
          <div className='connbadge-sep' />
          <label className='connbadge-field'>
            <div className='connbadge-field-label'>Server</div>
            <input
              type='text'
              placeholder='ws://localhost:3000/ws'
              value={serverUrl}
              onChange={e => setServerUrl(e.target.value)}
              onKeyDown={e => {
                if (e.code === 'Enter') {
                  e.preventDefault()
                  handleConnect()
                }
              }}
            />
          </label>
          <div className='connbadge-sep' />
          <div className={cls('connbadge-btn', { highlight: isOffline })} onClick={handleConnect}>
            Connect
          </div>
          {!isOffline && (
            <div className={cls('connbadge-btn', 'highlight')} onClick={handleOffline}>
              Go Offline
            </div>
          )}
          <div className='connbadge-btn' onClick={handleReset}>
            Reset
          </div>
        </div>
      )}
      <div
        className={cls('connbadge-dot', { online: !isOffline, offline: isOffline })}
        onClick={() => setExpanded(!expanded)}
      />
    </div>
  )
}
