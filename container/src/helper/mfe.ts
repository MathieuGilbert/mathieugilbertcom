export const getSrcPath = async (domain: string) => {
  const manifestPath = `${domain}/asset-manifest.json`

  return fetch(manifestPath)
    .then((res) =>
      res.json().then((manifest) => `${domain}${manifest.files['main.js']}`)
    )
    .catch((e) => {
      console.error('ERROR', e)
    })
}

export const appendRemoteScript = async (domain: string, scriptId: string) => {
  if (document.getElementById(scriptId) == null) {
    const src = await getSrcPath(domain)

    if (src != null) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = src
      script.async = true

      script.onload = () => {
        console.log('loaded: ', src)
      }
      script.onerror = (event) => {
        console.error('error: ', event)
      }

      document.body.appendChild(script)
    }
  }
}
