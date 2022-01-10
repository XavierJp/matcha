const commonStatusBadgeStyle = {
  fontSize: 'omega',
  fontWeight: 700,
  borderRadius: 20,
  pl: 4,
  pr: 4,
  py: 1,
  textTransform: 'none',
}

const Badge = {
  variants: {
    outline: {
      borderColor: 'bluefrance.500',
      color: 'bluefrance.500',
    },
    readOnly: {
      ...commonStatusBadgeStyle,
      bg: 'beige',
      pl: 2,
      pr: 2,
      borderRadius: 0,
      fontSize: ['sm', 'md'],
    },
    notRelevant: {
      ...commonStatusBadgeStyle,
      bg: '#e3e8ea',
      color: 'grey.800',
      border: '1px solid',
      borderColor: '#e3e8ea',
    },
    published: {
      ...commonStatusBadgeStyle,
      bg: 'greenmedium.300',
      color: 'grey.800',
      border: '1px solid',
      borderColor: 'greenmedium.200',
    },
    notPublished: {
      ...commonStatusBadgeStyle,
      bg: 'grey.300',
      color: 'grey.800',
      border: '1px solid',
      borderColor: 'grey.300',
    },
    toBePublished: {
      ...commonStatusBadgeStyle,
      bg: 'orangemedium.300',
      color: 'grey.800',
      border: '1px solid',
      borderColor: 'orangemedium.300',
    },
    pending: {
      ...commonStatusBadgeStyle,
      bg: 'greenmedium.200',
      color: '#a3b3b7',
      border: '1px solid',
      borderColor: 'greenmedium.200',
    },
    year: {
      ...commonStatusBadgeStyle,
      bg: 'greenmedium.300',
      color: 'grey.800',
      pl: '15px',
      pr: '15px',
    },
  },
}

export { Badge }
