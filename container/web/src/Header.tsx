import React from 'react'
import logo from './logo.svg'
import styled from 'styled-components'

const StyledHeader = styled.header`
  height: 100px;
  border: 1px solid black;
`

const StyledLogo = styled.img`
  height: 100%;
`

export const Header: React.FC = () => {
  return (
    <StyledHeader>
      <StyledLogo src={logo} alt="logo" />
      Welcome to the site
    </StyledHeader>
  )
}
