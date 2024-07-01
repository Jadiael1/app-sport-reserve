import { View, Text } from 'react-native'
import React, {createContext, useReducer} from 'react'
import {inicialState, userReducer} from '../reduces/UserReduces'
const UserContext = ({children}) => {
  return (
   <UserContext.Provider>
    {children}
   </UserContext.Provider>
  )
}

export default UserContext