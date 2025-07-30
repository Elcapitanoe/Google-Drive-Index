import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
          min-height: 2rem;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          min-height: 3rem;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          min-height: 2.5rem;
        `;
    }
  }}

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.surfaceHover};
            border-color: ${theme.colors.borderHover};
          }

          &:focus {
            outline: 2px solid ${theme.colors.primary};
            outline-offset: 2px;
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.textSecondary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.surfaceHover};
            color: ${theme.colors.text};
          }

          &:focus {
            outline: 2px solid ${theme.colors.primary};
            outline-offset: 2px;
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: white;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
          }

          &:focus {
            outline: 2px solid ${theme.colors.primary};
            outline-offset: 2px;
          }
        `;
    }
  }}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};
