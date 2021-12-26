import React from 'react'
import { Header } from './Header'
import { Content } from './Content'
import styled from 'styled-components'

const StyledApp = styled.div`
  text-align: center;
`

export const App: React.FC = () => {
  return (
    <>
      <Header />
      <Content />
    </>
  )
}
