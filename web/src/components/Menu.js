import React from 'react'
import styled from 'styled-components'

const StyledMenu = styled.div`
  grid-area: menu;
`

const Menu = () => {
  return (
    <StyledMenu className={'section'}>
      <ul>
        <li><a href='/'>Home</a></li>
        <li><a href='/'>About</a></li>
        <li><a href='/'>More?</a></li>
      </ul>
    </StyledMenu>
  )
}

export default Menu
