import React from 'react'
import useLongPress from '@/hooks/useLongPress'
import {
    ChakraProvider,
    Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Button
  } from "@chakra-ui/react";
  import bin from '../images/delete.svg'
  import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';

function Message({name, id, displayName, image, text, date, delMsg}) {
  const [delToggle, setDelToggle] = useState(false);

  const onLongPress = () => {
    if (name === displayName){
      setDelToggle(true)
    }
  } 

  const longPressOptions = {
    shouldPreventDefault:true,
    delay:400
  }

  const longPress = useLongPress(onLongPress, () => {}, longPressOptions)

    return (
        <ChakraProvider>  
          <Popover
        isOpen={delToggle}
        placement='top'
      >
        <PopoverTrigger>
        <div key={id}
                className={`${name === displayName ? 'bg-green-300' : 'bg-gray-400'}
                 p-3 rounded-md relative`}
                 {...longPress}
                 >
                    {image && <Image 
                      src={image} 
                      width={50} 
                      height={50} 
                      alt='photo'
                      className="h-[18rem] w-[18rem]"
                      />}
                      <h1 className="text-[20px] max-w-sm">{text}</h1>
                    <h6 className="text-[10px]">{date}</h6>                    
                </div>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader fontWeight='semibold'>Delete Message</PopoverHeader>
          <PopoverArrow />
          <PopoverBody>
            Are you sure you want to delete this message?
          </PopoverBody>
          <PopoverFooter display='flex' justifyContent='flex-end'>
            <ButtonGroup size='sm'>
              <Button variant='outline' onClick={() => setDelToggle(false)}>Cancel</Button>
              <Button 
                colorScheme='red' 
                id={id} 
                onClick={(e) => {
                  delMsg(e)
                  setDelToggle(false)
                  }}>delete</Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
                </ChakraProvider>
  )
}

export default Message