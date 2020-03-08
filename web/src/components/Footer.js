import React from 'react'
import styled from 'styled-components'

const StyledFooter = styled.div`
  grid-area: footer;
`

const Footer = () => {
  return (
    <StyledFooter className={'section'}>
      <span>&copy; Mathieu Gilbert, 2020</span>
    </StyledFooter>
  )
}

export default Footer
