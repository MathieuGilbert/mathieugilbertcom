import React from 'react'
import styled from 'styled-components'

const StyledMain = styled.div`
  grid-area: main;
`

const Main = () => {
  return (
    <StyledMain className={'section'}>
      <h1>About</h1>
      <p>
        My name is Mathieu Gilbert.
      </p>
    </StyledMain>
  )
}



export default Main
