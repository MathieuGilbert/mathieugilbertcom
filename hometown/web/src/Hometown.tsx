import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

interface HomeTownPageProps {
  country: string
  stateProv: string
  city: string
}

const HometownPage: React.FC<HomeTownPageProps> = ({
  country,
  stateProv,
  city,
}) => {
  return <>{`${city}, ${stateProv}, ${country}`}</>
}

export class Hometown extends HTMLElement {
  private observer: MutationObserver
  private mountPoint: HTMLElement | null = null

  constructor() {
    super()

    this.observer = new MutationObserver(() => this.update())
    this.observer.observe(this, { attributes: true })
  }

  connectedCallback() {
    this.mount()
  }

  disconnectedCallback() {
    this.unmount()
    this.observer.disconnect()
  }

  mount() {
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' })
    this.mountPoint = document.createElement('div')
    root.appendChild(this.mountPoint)

    render(
      <HometownPage
        country={this.getAttribute('country') ?? ''}
        stateProv={this.getAttribute('stateProv') ?? ''}
        city={this.getAttribute('city') ?? ''}
      />,
      this.mountPoint
    )
  }

  unmount() {
    unmountComponentAtNode(this.mountPoint ?? this)
  }

  update() {
    this.unmount()
    this.mount()
  }
}

customElements.define('hometown-page', Hometown)
