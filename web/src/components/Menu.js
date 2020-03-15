import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

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
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='/more'>More?</Link>
        </li>
      </ul>
    </StyledMenu>
  )
}

export default Menu
