import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

const StyledCard = styled.div<Omit<CardProps, 'hover'> & { $isHoverable?: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s ease-in-out;

  ${({ padding = 'md', theme }) => {
    switch (padding) {
      case 'sm':
        return `padding: ${theme.spacing.sm};`;
      case 'lg':
        return `padding: ${theme.spacing.xl};`;
      default:
        return `padding: ${theme.spacing.md};`;
    }
  }}

  ${({ $isHoverable, theme }) =>
    $isHoverable &&
    `
    cursor: pointer;
    
    &:hover {
      box-shadow: ${theme.shadows.md};
      border-color: ${theme.colors.borderHover};
    }
  `}
`;

export const Card: React.FC<CardProps> = ({ children, hover, ...props }) => {
  return <StyledCard $isHoverable={hover} {...props}>{children}</StyledCard>;
};