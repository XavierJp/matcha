import React from 'react'
import { MultiList } from '@appbaseio/reactivesearch'
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
// import useAuth from '../../common/hooks/useAuth'

import './facet.css'

import { AddFill, SubtractLine } from '../../theme/components/icons'

const Facet = ({
  componentId,
  dataField,
  nestedField,
  filterLabel,
  filters,
  title,
  showSearch,
  showCount,
  helpTextSection,
}) => {
  // let [auth] = useAuth()
  // let defaultValue = null
  // let defaultIndex = []

  // if (hasOneOfRoles(auth, ['instructeur'])) {
  //   if (componentId.startsWith('nom_academie')) {
  //     const userAcademies = auth?.academie?.split(',') || []
  //     defaultIndex = [0]
  //     defaultValue = compact(
  //       userAcademies.map((ua) => {
  //         return academies[ua]?.nom_academie
  //       })
  //     )
  //   } else if (componentId.startsWith('affelnet_statut') || componentId.startsWith('parcoursup_statut')) {
  //     defaultIndex = [0]
  //     //defaultValue = ["à publier"];
  //   }
  // }
  return (
    <Accordion allowMultiple bg='white' my={3}>
      <AccordionItem border='none'>
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton>
                <Box flex='1' textAlign='left'>
                  {title}
                </Box>
                {isExpanded ? (
                  <SubtractLine boxSize={3.5} color='bluefrance.500' />
                ) : (
                  <AddFill boxSize={3.5} color='bluefrance.500' />
                )}
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <MultiList
                className='facet-filters'
                componentId={componentId}
                dataField={dataField}
                nestedField={nestedField}
                filterLabel={filterLabel}
                react={{ and: filters.filter((e) => e !== componentId) }}
                // defaultValue={defaultValue}
                showCount={showCount}
                queryFormat='or'
                missingLabel='(Vide)'
                showCheckbox={true}
                innerClass={{
                  title: 'search-title',
                  input: 'search-input',
                  checkbox: 'search-checkbox',
                  label: 'search-label',
                }}
                showSearch={showSearch}
                placeholder='Filtrer'
                loader='Chargement'
              />
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  )
}

export default React.memo(Facet)
