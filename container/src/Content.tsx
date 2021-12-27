import React, { useEffect } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hometown-page': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

const getSrcPath = async (domain: string) => {
  const manifestPath = `${domain}/asset-manifest.json`

  return fetch(manifestPath).then((res) =>
    res.json().then((manifest) => `${domain}${manifest.files['main.js']}`)
  )
}

export const Content: React.FC = () => {
  const scriptId = 'hometown-page-script'

  useEffect(() => {
    const run = async () => {
      if (document.getElementById(scriptId) == null) {
        const src = await getSrcPath('https://d3o1je9zxe7ufr.cloudfront.net')

        const script = document.createElement('script')
        script.id = scriptId
        script.src = src
        script.async = true
        script.onload = () => {
          console.log('loaded', src)
        }
        script.onerror = (event) => {
          console.error('error: ', event)
        }

        document.body.appendChild(script)
      }
    }
    run()
  }, [])

  return <hometown-page />
}
