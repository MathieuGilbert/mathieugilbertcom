import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Normalize } from 'styled-normalize'
import { Layout } from './components'
import colors from './theme/colors.js'

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: helvetica, arial;
    background-color: ${colors.coal}
  }

  a {
    color: ${colors.blue}
  }
`

const App = () => {
  return (
    <>
      <Normalize />
      <GlobalStyle />
      <Layout />
    </>
  )
}

export default App
