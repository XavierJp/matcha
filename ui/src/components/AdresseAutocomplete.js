import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useCombobox } from 'downshift'

import { Input, Box } from '@chakra-ui/react'

const Wrapper = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  z-index: 1;
  position: absolute;
  list-style: none;
  background: #fff;
  overflow: auto;
  box-shadow: 0px 1px 8px rgba(8, 67, 85, 0.24);
  border-radius: 4px;
  li {
    width: 100%;
    padding: 0.5rem;
  }
`

export default (props) => {
  const [items, setItems] = useState([])
  const adresse = []

  const getAddress = async (value) => {
    const result = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${value}`)
    const data = await result.json()
    return data
  }

  const handleSearch = async (search) => {
    if (search) {
      const data = await getAddress(search)
      data.features.forEach((feat) => {
        const name = `${feat.properties.label}`
        const coordinates = feat.geometry.coordinates.reverse().join(',')
        adresse.push({ name: name, geo_coordonnees: coordinates })
      })
      return adresse
    }
    return items
  }

  const itemToString = (item) => (item ? item.name : '')
  const onSelectedItemChange = ({ selectedItem }) => props.handleValues(selectedItem)
  const onInputValueChange = async ({ inputValue }) => {
    if (inputValue === '') {
      props.handleValues({ name: '', geo_coordonnees: '' })
      return
    }
    setItems(await handleSearch(inputValue))
  }

  const { isOpen, getMenuProps, getInputProps, getComboboxProps, highlightedIndex, getItemProps } = useCombobox({
    itemToString,
    onInputValueChange,
    onSelectedItemChange,
    items,
    initialInputValue: props.defaultValue,
  })

  return (
    <Box>
      <div {...getComboboxProps()}>
        <Input
          onFocus={() => setTimeout(() => props.setFieldTouched(props.name, true), 100)}
          placeholder='Taper votre adresse complète'
          required={props.required ?? false}
          onPaste={(e) => e.preventDefault()}
          {...getInputProps()}
        />
      </div>
      <Wrapper {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <li
              style={highlightedIndex === index ? { backgroundColor: 'lightGrey' } : {}}
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {item.name}
            </li>
          ))}
      </Wrapper>
    </Box>
  )
}
