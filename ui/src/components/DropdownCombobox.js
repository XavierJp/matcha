import { useCombobox } from 'downshift'
import { Input, Box } from '@chakra-ui/react'

export default (props) => {
  let { saveSelectedItem, setInputItems, handleSearch, value, placeholder, inputItems, name } = props

  const itemToString = (item) => (item ? item.label : '')
  const onSelectedItemChange = ({ selectedItem }) => saveSelectedItem(selectedItem)
  const onInputValueChange = async ({ inputValue }) => setInputItems(await handleSearch(inputValue))

  const { isOpen, getMenuProps, getInputProps, getComboboxProps, highlightedIndex, getItemProps } = useCombobox({
    itemToString,
    onInputValueChange,
    onSelectedItemChange,
    items: inputItems,
    initialInputValue: value ?? '',
  })

  return (
    <div className=''>
      <div {...getComboboxProps()}>
        <Input mb='0' name={name} placeholder={placeholder || 'sélectionner un métier'} {...getInputProps()} />
      </div>
      <Box
        sx={{
          width: '100%',
          margin: 0,
          marginTop: '2px',
          padding: 0,
          zIndex: 1,
          position: 'absolute',
          listStyle: 'none',
          background: '#fff',
          overflow: 'auto',
          boxShadow: '0px 1px 8px rgba(8, 67, 85, 0.24)',
        }}
        {...getMenuProps()}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              style={
                highlightedIndex === index
                  ? { backgroundColor: 'lightGrey', width: '100%', padding: '0.5rem' }
                  : { width: '100%', padding: '0.5rem' }
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </li>
          ))}
      </Box>
    </div>
  )
}
