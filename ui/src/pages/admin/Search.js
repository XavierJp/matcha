import { memo, useEffect } from 'react'
import { ReactiveBase, DataSearch, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch'
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
  Button,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
} from '@chakra-ui/react'
import { NavLink, useLocation } from 'react-router-dom'

import constants from './admin.constants'
import Facet from '../../components/Facet/Facet'

import './search.css'

import { ArrowRightLine } from '../../theme/components/icons'
import { AiOutlineRight } from 'react-icons/ai'
import useAuth from '../../common/hooks/useAuth'
import ExportButton from '../../components/ExportButton/ExportButton'

export default memo(() => {
  const { filters, facetDefinition, dataSearchDefinition, exportableColumns, excludedFields } = constants
  const [auth] = useAuth()
  const location = useLocation()
  const toast = useToast()

  useEffect(() => {
    if (location.state?.newUser) {
      toast({
        title: 'Vérification réussi',
        description: 'Votre adresse mail a été validé avec succès.',
        position: 'top-right',
        status: 'success',
        duration: 7000,
        isClosable: true,
      })
    }
  }, [])

  const queryFilter = () => {
    if (auth.scope === 'all') return {}

    return {
      query: {
        match_phrase_prefix: {
          origine: auth.scope,
        },
      },
    }

    // return {
    //   query: {
    //     regexp: {
    //       origine: { value: `${auth.scope}*`, flags: 'ALL', case_insensitive: true, max_determinized_states: 100000 },
    //     },
    //   },
    // }
  }

  return (
    <Layout background='beige'>
      <Container maxW='container.xl' py={4}>
        <Flex justifyContent='space-between' alignItems='center'>
          <Breadcrumb spacing='4px' separator={<AiOutlineRight />} textStyle='xs' mb={3}>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href='#' textStyle='xs'>
                Administration des offres
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Link as={NavLink} to={`/${auth.scope === 'all' ? 'matcha' : auth.scope}/`}>
            <Button variant='primary' size='sm' mr={3}>
              Nouvelle entreprise
            </Button>
          </Link>
        </Flex>
        <div className='search-page'>
          <ReactiveBase url={`${process.env.REACT_APP_BASE_URL}/es/search`} app='formulaires'>
            <Grid templateColumns='1fr 3fr' gap={3} pt={3}>
              <GridItem>
                <Text fontWeight='700'>RECHERCHER</Text>
              </GridItem>
              <GridItem sx={{ margin: '0 .7em' }}>
                <div className='search-container'>
                  <DataSearch {...dataSearchDefinition} defaultQuery={queryFilter} />
                </div>
              </GridItem>
              <GridItem>
                <Text fontWeight='700'>FILTRER</Text>
                {auth.permissions.isAdmin
                  ? facetDefinition.map((f, i) => {
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
                          defaultQuery={queryFilter}
                          excludeFields={excludedFields}
                        />
                      )
                    })
                  : facetDefinition
                      .filter((x) => x.componentId !== 'origineFilter')
                      .map((f, i) => {
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
                            defaultQuery={queryFilter}
                            excludeFields={excludedFields}
                          />
                        )
                      })}
              </GridItem>
              <GridItem m={3}>
                <SelectedFilters clearAllLabel='Supprimer tous' />
                <ReactiveList
                  componentId='resultsFormulaire'
                  dataField='_id'
                  pagination={true}
                  innerClass={{ pagination: 'search-pagination' }}
                  loader='Chargement des résultats..'
                  size={5}
                  react={{
                    and: filters,
                  }}
                  excludeFields={excludedFields}
                  defaultQuery={queryFilter}
                  scrollOnChange={false}
                  renderResultStats={(stats) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexGrow: '1',
                        }}
                      >
                        <Text fontSize='sm'>
                          {stats.displayedResults} formulaires sur {stats.numberOfResults}
                        </Text>
                        <ExportButton
                          index='formulaires'
                          filters={filters}
                          defaultQuery={queryFilter}
                          columns={exportableColumns
                            .filter((c) => c.exportable)
                            .map((c) => ({ header: c.Header, fieldName: c.accessor, formatter: c.formatter }))}
                        />
                      </div>
                    )
                  }}
                  renderItem={({ offres, ...formulaire }) => {
                    let active = offres.filter((x) => x.statut === 'Active')

                    return (
                      <Link as={NavLink} to={`/formulaire/${formulaire.id_form}`} variant='card' key={formulaire._id}>
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
                              <Text>Aucune offre active</Text>
                            )}
                          </Flex>
                          <Flex justifyContent='space-between' textStyle='sm' py={3}>
                            <Box>
                              {formulaire.prenom && (
                                <Text>
                                  {formulaire.prenom?.toLowerCase().charAt(0).toUpperCase() +
                                    formulaire.prenom?.slice(1)}{' '}
                                  {formulaire.nom?.toUpperCase()}
                                </Text>
                              )}
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
