import React from 'react'
import styled from 'styled-components'

const StyledHeader = styled.div`
  grid-area: header;
`

const Header = () => {
  return (
    <StyledHeader className={'section'}>
      Welcome to my site.
    </StyledHeader>
  )
}

export default Header
