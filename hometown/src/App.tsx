import React from 'react'
import { render } from 'react-dom'

const App: React.FC = () => {
  return <>Edmonton, Alberta, Canada</>
}

class Hometown extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })
    const mountPoint = document.createElement('div')
    root.appendChild(mountPoint)

    render(<App />, mountPoint)
  }
}

customElements.define('hometown-page', Hometown)
