import styled from "styled-components";
import { NavLink, useLocation } from "react-router";

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  padding: 3rem;
  border-radius: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  border-top: 3px solid #1ecc71;
  color: #1a202c;
  padding: 1rem 1.65rem;

  transition: background-color 0.3s;

  &.active {
    background-color: rgba(46, 604, 13, 0.2);
    color: #222;
  }

  &:hover {
    background-color: rgba(46, 604, 13, 0.4);
  }
`;

const TabNav = ({
  pageOptions,
}: {
  pageOptions: { nameRouter: string; routePush: string }[];
}) => {
  const location = useLocation();

  return (
    <Nav>
      {pageOptions.map((option, index) => (
        <StyledNavLink
          key={index}
          to={option.routePush}
          className={location.pathname === option.routePush ? "active" : ""}
        >
          {option.nameRouter}
        </StyledNavLink>
      ))}
    </Nav>
  );
};

export default TabNav;
