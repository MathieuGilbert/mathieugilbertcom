import React, { useEffect } from 'react'
import { appendRemoteScript } from './helper/mfe'
import config from './config.json'
import { HometownMFEProps } from './types'

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
