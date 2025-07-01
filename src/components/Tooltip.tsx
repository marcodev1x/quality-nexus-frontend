import React from 'react'
import { FiHelpCircle } from 'react-icons/fi'
import styled from 'styled-components'

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-block;
`;

const TooltipContainer = styled.div`
  padding: 12px;
  position: absolute;
  top: 0;
  left: 110%;
  margin-left: .5rem;
  text-align: left;
  line-height: 1.2;
  border-radius: 4px;
  background: #222;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  min-width: 80px;
  width: 320px;
  z-index: 999;
`;

const Tooltip = ({ text }: { text: string }) => {
  const [tooltip, setTooltip] = React.useState(false)

  return (
    <TooltipWrapper
      onMouseOver={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
    >
      <FiHelpCircle color="#333" />
      {tooltip && <TooltipContainer>{text}</TooltipContainer>}
    </TooltipWrapper>
  )
}

export default Tooltip
