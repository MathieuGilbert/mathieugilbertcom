import React from 'react'
import logo from './logo.svg'
import styled from 'styled-components'

const StyledApp = styled.div`
  text-align: center;
`

export const App: React.FC = () => {
  return (
    <StyledApp>
      <header>
        <img src={logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </StyledApp>
  )
}

export default App
