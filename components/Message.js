import React from 'react'
import useLongPress from '@/hooks/useLongPress'
import {
    ChakraProvider,
    Button,
  } from "@chakra-ui/react";
  import bin from '../images/delete.svg'
  import Image from 'next/image';
import Head from 'next/head';

function Message({name, id, displayName, image, text, date, delMsg, delToggle, setDelToggle}) {

    return (
        <ChakraProvider>            
    <div key={id}
                className={`${name === displayName ? 'bg-green-300' : 'bg-gray-400'}
                 p-3 rounded-md relative`}
                 >
                    {/* {name === displayName && <Image 
                        src={bin} 
                        width={20} 
                        height={20} 
                        alt="delete"
                        className='absolute top-1 right-1 cursor-pointer'
                        id={id}
                        onClick={delMsg}
                        />} */}
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
                </ChakraProvider>
  )
}

export default Message