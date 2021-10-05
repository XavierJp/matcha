const commonButtonStyle = {
  borderRadius: 0,
  textTransform: 'none',
  fontWeight: 400,
  // _focus: { boxShadow: '0 0 0 3px #000091', outlineColor: 'bluefrance.500' },
  _focus: { boxShadow: 'none', outlineColor: 'none' },
  _focusVisible: { boxShadow: '0 0 0 3px #2A7FFE', outlineColor: 'bluefrance.500' },
}

const Button = {
  variants: {
    greyed: {
      ...commonButtonStyle,
      bg: 'grey.200',
      color: 'grey.600',
    },
    secondary: {
      ...commonButtonStyle,
      bg: 'white',
      color: 'bluefrance.500',
      border: '1px solid',
      borderColor: 'bluefrance.500',
      _hover: { bg: 'grey.200' },
    },
    primary: {
      ...commonButtonStyle,
      bg: 'bluefrance.500',
      color: 'white',
      _hover: { bg: 'blue.700' },
    },
    pill: {
      ...commonButtonStyle,
      borderRadius: 24,
      height: 'auto',
      fontSize: 'zeta',
      color: 'bluefrance',
      px: 3,
      py: 1,
      _hover: { bg: 'grey.200', textDecoration: 'none' },
    },
  },
}

export { Button }
