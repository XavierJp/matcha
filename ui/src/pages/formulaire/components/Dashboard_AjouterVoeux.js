import { Modal, ModalContent } from '@chakra-ui/react'
import AjouterVoeux from './AjouterVoeux'

export default (props) => {
  let { isOpen, onClose } = props

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='full'>
      <ModalContent>
        <AjouterVoeux {...props} fromDashboard={true} onClose={onClose} />
      </ModalContent>
    </Modal>
  )
}
