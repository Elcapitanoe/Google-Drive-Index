import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease-in-out;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.surface};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput id={inputId} $hasError={!!error} {...props} />
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </InputContainer>
  );
};
