import React from 'react'
import styled from 'styled-components'

const StyledMenu = styled.div`
  grid-area: menu;

  @media (max-width: 480px) {
    ul {
      display: flex;
      justify-content: space-between;
    }
  }
`

const Menu = () => {
  return (
    <StyledMenu className={'menu'}>
      <ul>
        <li><a href='/'>Home</a></li>
        <li><a href='/'>About</a></li>
        <li><a href='/'>More?</a></li>
      </ul>
    </StyledMenu>
  )
}

export default Menu
