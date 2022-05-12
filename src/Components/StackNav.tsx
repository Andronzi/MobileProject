import React, { ReactNode, Children, useState } from "react"
import { useContext } from "react"
import { View } from "react-native"

export type NavScreenComp = React.FC<{
  component: React.FC<any>,
  name: string,
  transProps?: any
}>

export type Navigator = {
  goTo: (name: string) => void,
  goBack: () => void;
}

export type NavContainer = { 
  Stack: React.FC<{ children: ReactNode}>, 
  Screen: NavScreenComp 
} 

export function createNavContainer(): NavContainer
{
  type screenStackContextType = { stack: string[], setStack: (stack: string[]) => void }
  const screenStackContext = 
    React.createContext<screenStackContextType>({ stack: [], setStack: () => {} });

  const Stack: React.FC<{ children: ReactNode}> = ({ children }) => {
    const [context, setContext] = useState<screenStackContextType>({ stack: [], setStack: () => {} })

    if (!context.stack.length) {
      setContext({
        stack: ["default"], 
        setStack: newStack => {
          setContext(prev => ({...prev, stack: newStack}));
        } 
      })
    }
    
    return <View>
      <screenStackContext.Provider value={context}>
        { 
          Children.toArray(children).find(item => {
            if (React.isValidElement(item)) {
              return item.props.name === context.stack[context.stack.length - 1];
            }
            return false;
          })
        }
      </screenStackContext.Provider>
    </View>
  }

  const Screen: NavScreenComp = ({ component, transProps }) => {
    const { stack, setStack } = useContext(screenStackContext);
    
    return component({ 
      ...transProps,
      navigator: { 
        goTo: (name: string) => {
          setStack(stack.concat(name));
        },
        goBack: () => {
          if (stack.length > 1)
            setStack(stack.slice(0, -2));
        }
    }});
  }

  return { Stack, Screen }
}