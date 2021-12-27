import React from 'react'
import styled from 'styled-components'
import { Header } from './Header'
import { HometownMFE } from './HometownMFE'

const HometownMFEBackdrop = styled.div`
  padding: 10px;
  background-color: #e70a0a;
`

export const App: React.FC = () => {
  const [country, setCountry] = React.useState('')
  const [stateProv, setStateProv] = React.useState('')
  const [city, setCity] = React.useState('')

  const onChangeCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value)
  }

  const onChangeStateProv = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateProv(e.target.value)
  }

  const onChangeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value)
  }

  return (
    <>
      <Header />
      Pass location props to HometownMFE: <br />
      Country: <input type="text" name="country" onChange={onChangeCountry} />
      <br />
      State/Province:{' '}
      <input type="text" name="stateProv" onChange={onChangeStateProv} />
      <br />
      City: <input type="text" name="city" onChange={onChangeCity} />
      <br />
      MFE:
      <br />
      <HometownMFEBackdrop>
        <HometownMFE country={country} stateProv={stateProv} city={city} />
      </HometownMFEBackdrop>
    </>
  )
}
