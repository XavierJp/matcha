import { ReactiveBase, DataSearch, MultiList, ReactiveList, ResultCard, SingleList } from '@appbaseio/reactivesearch'
import { Layout } from '../../components'
import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Button,
} from '@chakra-ui/react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'

const url = 'http://localhost/api/es/search'

const CustomAccordionItem = ({ title, children }) => (
  <AccordionItem bg='white' my={3}>
    {({ isExpanded }) => (
      <>
        <h2>
          <AccordionButton>
            <Box flex='1' textAlign='left'>
              {title}
            </Box>
            {isExpanded ? <AiOutlineMinus fontSize='12px' /> : <AiOutlinePlus fontSize='12px' />}
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>{children}</AccordionPanel>
      </>
    )}
  </AccordionItem>
)

export default () => {
  return (
    <Layout background='beige'>
      <Container maxW='container.xl' py={4}>
        <ReactiveBase url={url} app='formulaires'>
          <DataSearch
            componentId='searchFormulaire'
            dataField={['raison_sociale', 'siret', 'nom', 'prenom', 'email']}
            fieldWeights={[4, 1, 2, 2, 3]}
            highlight={true}
            URLParams={true}
            queryFormat='and'
            placeholder="Rechercher par nom d'entreprise, siret, nom, prénom ou email"
          />
          <Grid templateColumns='1fr 3fr' gap={3} pt={3}>
            <GridItem>
              <Text fontWeight='700'>FILTRER</Text>
              <Accordion defaultIndex={0} allowToggle>
                <CustomAccordionItem title='Statut'>
                  <SingleList
                    componentId='statusFilter'
                    dataField='offres.statut.keyword'
                    nestedField='offres'
                    showSearch={false}
                  />
                </CustomAccordionItem>
                <CustomAccordionItem title='Siret'>
                  <MultiList componentId='siretFilter' dataField='siret.keyword' />
                </CustomAccordionItem>
                <CustomAccordionItem title='Metier'>
                  <MultiList componentId='libelleFilter' dataField='offres.libelle.keyword' nestedField='offres' />
                </CustomAccordionItem>
                <CustomAccordionItem title='Origine'>
                  <MultiList componentId='origineFilter' dataField='origine.keyword' />
                </CustomAccordionItem>
                <CustomAccordionItem title='Niveau'>
                  <MultiList componentId='niveauFilter' dataField='offres.niveau.keyword' nestedField='offres' />
                </CustomAccordionItem>
              </Accordion>
            </GridItem>
            <GridItem>
              <ReactiveList
                componentId='resultsFormulaire'
                pagination={true}
                react={{
                  and: [
                    'siretFilter',
                    'statusFilter',
                    'origineFilter',
                    'searchFormulaire',
                    'niveauFilter',
                    'libelleFilter',
                  ],
                }}
                size={4}
                renderResultStats={(stats) => {
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>
                        {stats.displayedResults} formulaires sur {stats.numberOfResults}
                      </Text>
                      <Text>Coucou</Text>
                      <Box>
                        <Button>Exporter</Button>
                      </Box>
                    </div>
                  )
                }}
                renderItem={(formulaire) => {
                  let active = formulaire.offres.filter((x) => x.statut === 'Active').length
                  return (
                    <Box bg='white' p={5} my={3}>
                      <Flex key={formulaire._id} textStyle='sm' justifyContent='space-between' alignItems='flex-start'>
                        <Box>
                          <Text fontWeight='700'>{formulaire.raison_sociale}</Text>
                          <Text fontSize='xs' variant='outline'>
                            SIRET: {formulaire.siret}
                          </Text>
                        </Box>
                        {active > 0 ? (
                          <Text>
                            <Badge variant='outline'>{active}</Badge> offre(s) active(s)
                          </Text>
                        ) : (
                          <Text>Aucune offre visible</Text>
                        )}
                      </Flex>
                      <Flex direction='column' textStyle='sm' py={3}>
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
                        <Text></Text>
                        <Text></Text>
                      </Flex>
                      <Text fontSize='xs'>Origine : {formulaire.origine}</Text>
                    </Box>
                  )
                }}
              />
            </GridItem>
          </Grid>
        </ReactiveBase>
      </Container>
    </Layout>
  )
}
