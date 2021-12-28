import React, { useEffect } from 'react'
import { appendRemoteScript } from './helper/mfe'
import config from './config.json'

interface HometownMFEProps {
  country?: string
  stateProv?: string
  city?: string
}

interface HometownPageProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >,
    HometownMFEProps {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hometown-page': HometownPageProps
    }
  }
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
  // return <hometown-page location={{ country, stateProv, city }} />
}
