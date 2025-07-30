import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div<LoadingSpinnerProps>`
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top: 2px solid ${({ color, theme }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          width: 1rem;
          height: 1rem;
        `;
      case 'lg':
        return `
          width: 2rem;
          height: 2rem;
        `;
      default:
        return `
          width: 1.5rem;
          height: 1.5rem;
        `;
    }
  }}
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = props => {
  return (
    <Container>
      <Spinner {...props} />
    </Container>
  );
};
