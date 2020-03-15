import React from 'react'
import styled from 'styled-components'
import {
  Switch,
  Route
} from 'react-router-dom'
import {
  About,
  More,
  Home
} from './pages'

const StyledMain = styled.div`
  grid-area: main;
`

const Main = () => {
  return (
    <StyledMain className={'main'}>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/more">
          <More />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </StyledMain>
  )
}

export default Main
