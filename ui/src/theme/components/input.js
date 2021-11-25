const Input = {
  parts: ['field'],
  baseStyle: {
    field: {
      _readOnly: {
        borderColor: 'grey.400',
      },
    },
  },
  variants: {
    edition: {
      field: {
        borderRadius: 0,
        fontWeight: 700,
        bg: 'grey.200',
        color: 'grey.800',
        border: '1px solid',
        borderColor: 'bluefrance.500',
      },
    },
    outline: {
      field: {
        borderBottomRadius: 0,
        borderWidth: 0,
        borderBottom: '2px solid',
        marginBottom: '-2px',
        borderColor: 'grey.600',
        bg: 'grey.200',
        _readOnly: {
          borderColor: 'grey.400',
          userSelect: 'none',
        },
      },
    },
  },
}

export { Input }
