import { QuestionIcon } from '@chakra-ui/icons'
import {
  Box,
  Icon,
  IconButton,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import type { PlacementWithLogical } from '@chakra-ui/react'
import { BsCircleFill } from 'react-icons/bs'
import { Actor } from '~/constant/actor'

const InfoPopup = ({
  iconBgColor,
  iconColor,
  className,
  popoverPlacement,
  view,
}: {
  iconBgColor: string
  iconColor: string
  className: string
  popoverPlacement: PlacementWithLogical | undefined
  view: Actor
}) => {
  return (
    <Box className={className}>
      <Popover placement={popoverPlacement} trigger="hover">
        <PopoverTrigger>
          <IconButton
            aria-label="Info popup for applicant detail"
            icon={<QuestionIcon />}
            borderRadius="full"
            bg={iconColor}
            color={iconBgColor}
            _hover={{ background: { iconColor } }}
            fontSize="50px"
          />
        </PopoverTrigger>
        <PopoverContent rootProps={{ style: { right: 0 } }} width="200px">
          <PopoverBody>
            <UnorderedList styleType="none" spacing="2">
              {view === Actor.APPLICANT && (
                <ListItem className="flex items-center">
                  <Icon as={BsCircleFill} marginRight="2" fill="#46FFDE" />
                  <Text>Accepted</Text>
                </ListItem>
              )}
              <ListItem className="flex items-center">
                <Icon as={BsCircleFill} marginRight="2" fill="#0038FF" />
                <Text>Offered</Text>
              </ListItem>
              <ListItem className="flex items-center">
                <Icon as={BsCircleFill} marginRight="2" fill="#FFBD3C" />
                <Text>Pending Review</Text>
              </ListItem>
              <ListItem className="flex items-center">
                <Icon as={BsCircleFill} marginRight="2" fill="#FF0099" />
                <Text>Interviewed</Text>
              </ListItem>
              <ListItem className="flex items-center">
                <Icon as={BsCircleFill} marginRight="2" fill="#FF0000" />
                <Text>Rejected</Text>
              </ListItem>
            </UnorderedList>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
}

export default InfoPopup
