import React from 'react'
import styled from 'styled-components'

const StyledHeader = styled.div`
  grid-area: header;
`

const Header = () => {
  return (
    <StyledHeader className={'header'}>
      Welcome to my site.<br />
      YOU HAVE BEEN CI/CD!
    </StyledHeader>
  )
}

export default Header
