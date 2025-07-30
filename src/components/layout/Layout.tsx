import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
    </LayoutContainer>
  );
};
