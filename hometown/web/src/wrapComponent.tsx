import { render, unmountComponentAtNode } from 'react-dom'

export const wrapComponent = (
  tagName: string,
  component: (element: any) => React.ReactElement<any, any>
) => {
  class Element extends HTMLElement {
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
      this.mountPoint = this.mountPoint ?? document.createElement('div')
      root.appendChild(this.mountPoint)

      render(component(this), this.mountPoint)
    }

    unmount() {
      this.mountPoint && unmountComponentAtNode(this.mountPoint)
    }

    update() {
      this.unmount()
      this.mount()
    }
  }

  customElements.define(tagName, Element)
}
