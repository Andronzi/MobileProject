import React, { ReactNode, useState } from "react"
import { useContext } from "react"
import { View } from "react-native"

export type NavScreenComp = React.FC<{
  component: React.FC<any>,
  name: string,
  transProps?: any
}>

export type Navigator = {
  goTo: (name: string, transProps?: {[key: string]: any}) => void,
  goBack: (transProps?: {[key: string]: any}) => void;
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

  const tempTransPropsContext = React.createContext({ props: {} });

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
      <tempTransPropsContext.Provider value={useContext(tempTransPropsContext)}>
        <screenStackContext.Provider value={context}>
          {/* { 
            Children.toArray(children).find(item => {
              if (React.isValidElement(item)) {
                return item.props.name === context.stack[context.stack.length - 1];
              }
              return false;
            })
          } */}
          { children }
        </screenStackContext.Provider>
      </tempTransPropsContext.Provider>
    </View>
  }

  const Screen: NavScreenComp = ({ name, component, transProps }) => {
    const { stack, setStack } = useContext(screenStackContext);
    let tempTransProps = useContext(tempTransPropsContext);
    
    
    const navigator: Navigator = {
      goTo: (name, _transProps = {}) => {
        tempTransProps.props = _transProps;
        setStack(stack.concat(name));
      },
      goBack: (_transProps = {}) => {
        if (stack.length > 1) {
          tempTransProps.props = _transProps;
          setStack(stack.slice(0, -1));
        }
      }
    }

    const element = component({ 
      ...transProps,
      ...(name === stack[stack.length - 1] ? tempTransProps.props : {}),
      navigator
    })
    tempTransProps.props = {};
    
    return <View style={{
      display: name === stack[stack.length - 1] ? "flex" : "none"
    }}>
      { element }
    </View>
  }

  return { Stack, Screen }
}