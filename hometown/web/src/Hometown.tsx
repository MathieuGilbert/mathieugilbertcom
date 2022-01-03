import React from 'react'
import { wrapComponent } from './wrapComponent'

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

wrapComponent('hometown-page', (element) => (
  <HometownPage
    country={element.getAttribute('country') ?? ''}
    stateProv={element.getAttribute('stateProv') ?? ''}
    city={element.getAttribute('city') ?? ''}
  />
))
