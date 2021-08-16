import React from 'react'
import { ReactiveBase, DataSearch, ReactiveList } from '@appbaseio/reactivesearch'
import { Layout } from '../../components'
import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Text,
  HStack,
  Accordion,
  AccordionItem,
  Button,
  Link,
} from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import constants from './admin.constants'
import Facet from '../../components/Facet/Facet'

import './search.css'
import { ArrowRightLine } from '../../theme/components/icons'

const ListeOffres = ({ offres }) => {
  return (
    <Accordion>
      {offres.map((offre) => {
        let debut = moment(offre.date_debut_apprentissage).format('DD/MM/YYYY')
        return (
          <AccordionItem key={offre._id}>
            <Box flex='1' textAlign='left'>
              {offre.libelle} - {offre.niveau} - {debut}
            </Box>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default React.memo(() => {
  const { filters, facetDefinition, dataSearchDefinition } = constants

  return (
    <Layout background='beige'>
      <Container maxW='container.xl' py={4}>
        <div className='search-page'>
          <ReactiveBase url={`${process.env.REACT_APP_BASE_URL}/es/search`} app='formulaires'>
            <Grid templateColumns='1fr 3fr' gap={3} pt={3}>
              <GridItem>
                <Text fontWeight='700'>RECHERCHER</Text>
              </GridItem>
              <GridItem sx={{ margin: '0 .7em' }}>
                <div className='search-container'>
                  <DataSearch {...dataSearchDefinition} />
                </div>
              </GridItem>
              <GridItem>
                <Text fontWeight='700'>FILTRER</Text>
                {facetDefinition.map((f, i) => {
                  return (
                    <Facet
                      key={i}
                      title={f.title}
                      filterLabel={f.filterLabel}
                      filters={filters}
                      selectAllLabel={f.selectAllLabel}
                      sortBy={f.sortBy}
                      componentId={f.componentId}
                      dataField={f.dataField}
                      nestedField={f.nestedField}
                      showSearch={f.showSearch}
                      showCount={f.showCount}
                    />
                  )
                })}
              </GridItem>
              <GridItem>
                <ReactiveList
                  componentId='resultsFormulaire'
                  dataField='_id'
                  pagination={true}
                  infiniteScroll={true}
                  innerClass={{ pagination: 'search-pagination' }}
                  loader='Chargement des résultats..'
                  react={{
                    and: filters,
                  }}
                  size={4}
                  renderResultStats={(stats) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexGrow: '1',
                          margin: '0 .7em',
                        }}
                      >
                        <Text fontSize='sm'>
                          {stats.displayedResults} formulaires sur {stats.numberOfResults}
                        </Text>
                        <Button variant='secondary' size='xs' isDisabled>
                          Exporter
                        </Button>
                      </div>
                    )
                  }}
                  renderItem={({ offres, ...formulaire }) => {
                    let active = offres.filter((x) => x.statut === 'Active')
                    // let annulé = offres.filter((x) => x.statut === 'Annulée')
                    // let pourvue = offres.filter((x) => x.statut === 'Pourvue')

                    return (
                      <Link as={NavLink} to={`/formulaire/${formulaire.id_form}`} variant='card' target='_blank'>
                        <Box bg='none' key={formulaire._id}>
                          <Flex
                            key={formulaire._id}
                            textStyle='sm'
                            justifyContent='space-between'
                            alignItems='flex-start'
                          >
                            <Box>
                              <Text fontWeight='700'>{formulaire.raison_sociale}</Text>
                              <Text fontSize='xs' variant='outline'>
                                SIRET: {formulaire.siret}
                              </Text>
                            </Box>
                            {active.length > 0 ? (
                              <Text>
                                <Badge variant='outline'>{active.length}</Badge> offre(s) active(s)
                              </Text>
                            ) : (
                              <Text>Aucune offre visible</Text>
                            )}
                          </Flex>
                          <Flex justifyContent='space-between' textStyle='sm' py={3}>
                            <Box>
                              <Text>
                                {formulaire.prenom?.toLowerCase().charAt(0).toUpperCase() + formulaire.prenom?.slice(1)}{' '}
                                {formulaire.nom?.toUpperCase()}
                              </Text>
                              <Text>{formulaire.adresse}</Text>
                              <HStack gap={3}>
                                <Text>{formulaire.telephone}</Text>
                                <Text>—</Text>
                                <Text>{formulaire.email}</Text>
                              </HStack>
                            </Box>
                            <ArrowRightLine alignSelf='flex-end' color='bluefrance.500' boxSize={5} />
                          </Flex>
                          <Text fontSize='xs'>Origine : {formulaire.origine}</Text>
                          {/* {annulé.length > 0 && (
                          <Accordion pt={5} allowToggle>
                          <CustomAccordionItem title='Offre(s) Annulée(s) :'>
                          {annulé.map((offre) => {
                            let debut = moment(offre.date_debut_apprentissage).format('DD/MM/YYYY')
                            return (
                              <Flex>
                              {offre.libelle} - {offre.niveau}
                              <Spacer />
                              Date de début : {debut}
                              </Flex>
                              )
                            })}
                            </CustomAccordionItem>
                            </Accordion>
                            )}
                            {pourvue.length > 0 && (
                              <Accordion pt={5} allowToggle>
                              <CustomAccordionItem title='Offre(s) Pourvue(s) :'>
                              {pourvue.map((offre) => {
                                let debut = moment(offre.date_debut_apprentissage).format('DD/MM/YYYY')
                                return (
                                  <Flex flex='1' textAlign='left'>
                                  {offre.libelle} - {offre.niveau} - {debut}
                                  </Flex>
                                  )
                                })}
                                </CustomAccordionItem>
                                </Accordion>
                                )}
                                {active.length > 0 && (
                                  <Accordion allowToggle>
                                  <CustomAccordionItem title='Offre(s) Active(s) :'>
                                  {active.map((offre) => {
                                    let debut = moment(offre.date_debut_apprentissage).format('DD/MM/YYYY')
                                    return (
                                      <Flex flex='1' textAlign='left'>
                                      {offre.libelle} - {offre.niveau} - {debut}
                                      </Flex>
                                      )
                                    })}
                                    </CustomAccordionItem>
                                    </Accordion>
                                  )} */}
                        </Box>
                      </Link>
                    )
                  }}
                />
              </GridItem>
            </Grid>
          </ReactiveBase>
        </div>
      </Container>
    </Layout>
  )
})
