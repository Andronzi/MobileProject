import React, { ReactNode, useEffect, useState } from "react"
import { useMemo } from "react"
import { useContext } from "react"
import { View } from "react-native"

export type NavScreenComp = React.FC<{
  component: React.FC<any>,
  name: string,
  transProps?: any
}>

export type Navigator = {
  goTo: (name: string, 
    transProps?: ({[key: string]: any}) | null,
    callback?: (() => void) | null
  ) => void,
  goBack: (
    transProps?: ({[key: string]: any}) | null,
    callback?: (() => void) | null
  ) => void
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

  const tempOptionsContext = React.createContext<{ 
    props: null | object, 
    callback: (() => void) | null 
  }>
  ({ props: null, callback: null });

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
      <tempOptionsContext.Provider value={useContext(tempOptionsContext)}>
        <screenStackContext.Provider value={context}>
          { children }
        </screenStackContext.Provider>
      </tempOptionsContext.Provider>
    </View>
  };

  const Screen: NavScreenComp = ({ name, component, transProps }) => {
    const { stack, setStack } = useContext(screenStackContext);
    const tempOptions = useContext(tempOptionsContext);
    const navigator: Navigator = {
      goTo: (name, transProps = null, callback = null) => {
        tempOptions.props = transProps;
        tempOptions.callback = callback;
        setStack(stack.concat(name));
      },
      goBack: (transProps = null, callback = null) => {
        if (stack.length > 1) {
          tempOptions.props = transProps;
          tempOptions.callback = callback;
          setStack(stack.slice(0, -1));
        }
      }
    }

    const isTopElement = name === stack[stack.length - 1];
    let tempProps: object | null = null;
    let callback: (() => void) | null = null;
    if (isTopElement) {
      tempProps = tempOptions.props;
      callback = tempOptions.callback;
    }

    const element = useMemo(() =>
      React.createElement(
        component, { 
          ...transProps,
          ...tempProps,
          navigator 
        }),
      [ component, transProps, tempProps, navigator ]
    );

    useEffect(() => { 
      if (callback) callback();
    }, [callback]);
    
    return <View style={{ display: isTopElement ? "flex" : "none" }}>
      { element }
    </View>
  }

  return { Stack, Screen }
}