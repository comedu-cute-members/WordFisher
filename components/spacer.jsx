// spacer.js

import styled from 'styled-components';
import { Button, Link, ButtonGroup } from "@nextui-org/react";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

const Wrapper = styled.div`
  border: 1px solid gray;
  height: 6rem;
  line-height: 1.5;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    font-size: 0.5rem;
    font-weight: 800;
    letter-spacing: 5px;
  }
  .right {
    display: flex;
    align-items: center;
  }
`;

const Spacer = styled.div`
  height: 4rem;
`;

export default function Header() {
  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <Link to="/" className="logo">
            REACTERS
          </Link>
          <div className="right">
            <Button to="/login">Hi</Button>
          </div>
        </Wrapper>
      </HeaderBlock>
      <Spacer />
    </>
  );
}