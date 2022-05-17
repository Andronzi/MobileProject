import React, { ReactNode, useState } from "react"
import { useMemo } from "react"
import { useContext } from "react"
import { View } from "react-native"

export type NavScreenComp = React.FC<{
  component: React.FC<any>,
  name: string,
  transProps?: any
}>

export type Navigator = {
  goTo: (name: string, transProps?: ({[key: string]: any}) | null) => void,
  goBack: (transProps?: ({[key: string]: any}) | null) => void;
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

  const tempTransPropsContext = 
    React.createContext<{ props: null | object}>({ props: null });

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
          { children }
        </screenStackContext.Provider>
      </tempTransPropsContext.Provider>
    </View>
  };

  const Screen: NavScreenComp = ({ name, component, transProps }) => {
    const { stack, setStack } = useContext(screenStackContext);
    const tempTransProps = useContext(tempTransPropsContext);
    const navigator: Navigator = {
      goTo: (name, _transProps = null) => {
        tempTransProps.props = _transProps;
        setStack(stack.concat(name));
      },
      goBack: (_transProps = null) => {
        if (stack.length > 1) {
          tempTransProps.props = _transProps;
          setStack(stack.slice(0, -1));
        }
      }
    }

    const isTopElement = name === stack[stack.length - 1];
    let tempProps: object | null = null;
    if (isTopElement) {
      tempProps = tempTransProps.props;
      tempTransProps.props = null;
    }

    const element = useMemo(() =>
      React.createElement(
        component, { 
          ...transProps,
          navigator 
        }),
      [ component, transProps, tempProps, navigator ]
    );
    
    return <View style={{ display: isTopElement ? "flex" : "none" }}>
      { element }
    </View>
  }

  return { Stack, Screen }
}