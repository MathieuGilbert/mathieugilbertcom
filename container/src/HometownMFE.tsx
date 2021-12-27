import React, { useEffect } from 'react'
import { appendRemoteScript } from './helper/mfe'
import config from './config.json'

interface HometownPageProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  country?: string
  stateProv?: string
  city?: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hometown-page': HometownPageProps
    }
  }
}

interface HometownMFEProps {
  country?: string
  stateProv?: string
  city?: string
}

export const HometownMFE: React.FC<HometownMFEProps> = ({
  country,
  stateProv,
  city,
}) => {
  useEffect(() => {
    appendRemoteScript(config.hometownMfeDomain, 'hometown-page-script')
  }, [])

  return <hometown-page country={country} stateProv={stateProv} city={city} />
}
