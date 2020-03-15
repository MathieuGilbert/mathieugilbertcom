import React from 'react'
import { Router } from 'react-router'
import { createGlobalStyle } from 'styled-components'
import { createBrowserHistory } from 'history'
import { Normalize } from 'styled-normalize'
import { Layout } from './components'
import colors from './theme/colors.js'

const history = createBrowserHistory()

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
      <Router history={history}>
        <Layout />
      </Router>
    </>
  )
}

export default App
