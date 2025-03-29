import { Link } from "react-router";
import styled from "styled-components";

const Sublink = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;

  a {
    font-weight: 500;
    color: #222;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #fff;
  }

  p {
    color: var(--text);
  }
`;

const SubTextWithLink = ({
  text,
  link,
  linkname,
  isNoRefresh,
}: {
  text: string;
  link: string;
  linkname: string;
  isNoRefresh?: boolean;
}) => {
  return (
    <Sublink>
      <p>{text}</p>
      {!isNoRefresh && <a href={link}>{linkname}</a>}
      {isNoRefresh && <Link to={link}>{linkname}</Link>}
    </Sublink>
  );
};

export default SubTextWithLink;
