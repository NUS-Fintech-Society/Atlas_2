import { QuestionIcon } from '@chakra-ui/icons'
import {
  Box,
  Icon,
  IconButton,
  ListItem,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { BsCircleFill } from 'react-icons/bs'

const InfoPopup = () => {
  return (
    <Box className="bottom-25 absolute right-20">
      <Popover placement="left">
        <PopoverTrigger>
          <IconButton
            aria-label="Info popup for applicant detail"
            icon={<QuestionIcon />}
            borderRadius="full"
            bg="None"
            _hover={{ background: 'None' }}
            fontSize="50px"
            stroke="#02005A"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton />
          <PopoverBody>
            <UnorderedList styleType="none" spacing="2">
              <ListItem className="flex items-center">
                <Icon
                  as={BsCircleFill}
                  marginLeft="2"
                  marginRight="2"
                  fill="#46FFDE"
                />
                <Text>Accepted</Text>
              </ListItem>
              <ListItem className="flex items-center">
                <Icon
                  as={BsCircleFill}
                  marginLeft="2"
                  marginRight="2"
                  fill="#0038FF"
                />
                <Text>Offered</Text>
              </ListItem>
              <ListItem className="flex items-center">
                <Icon
                  as={BsCircleFill}
                  marginLeft="2"
                  marginRight="2"
                  fill="#FFBD3C"
                />
                <Text>Pending Review</Text>
              </ListItem>
              <ListItem className="flex items-center">
                <Icon
                  as={BsCircleFill}
                  marginLeft="2"
                  marginRight="2"
                  fill="#FF0099"
                />
                <Text>Interviewed</Text>
              </ListItem>
            </UnorderedList>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
}

export default InfoPopup
