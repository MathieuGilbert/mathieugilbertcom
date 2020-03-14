import React from 'react'
import styled from 'styled-components'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import Menu from './Menu'
import colors from '../theme/colors.js'

const StyledLayout = styled.div`
  display: grid;
  grid-gap: 10px;
  height: 100%;

  @media (max-width: 480px) {
    grid-template-rows: 100px 100px 1fr 100px;
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "menu"
      "main"
      "footer";
  }

  @media (min-width: 480px) {
    grid-template-rows: 100px 1fr 100px;
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header header"
      "menu   main"
      "menu   footer";
  }

  .footer,
  .header,
  .main,
  .menu {
    background-color: ${colors.white};
    color: ${colors.coal};
    padding: 20px;
  }
`

const Layout = () => {
  return (
    <StyledLayout>
      <Header/>
      <Menu />
      <Main />
      <Footer />
    </StyledLayout>
  )
}

export default Layout
