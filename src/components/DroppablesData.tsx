import React, { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";

import { ButchObj } from "../Butch/ButchObj";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import createProgramBlock from "../Utilities/ProgramBlockLayout";
import useForceUpdate from "../hooks/useForceUpdate";

type DNDContextType = [ButchObj, React.Dispatch<React.SetStateAction<number>>];
const plug: DNDContextType = [
  new ButchObj({}, { __hash: "", k: "" }, { __hash: "", k: "" }),
  () => {
    return;
  },
];
const DNDElementsContext = React.createContext<DNDContextType>(plug);

export function useDNDElements() {
  return useContext(DNDElementsContext);
}

interface DNDElementsProviderProps {
  programData: ButchObj;
  forceUpdate: () => void;
}

export function DNDElementsProvider({ programData, forceUpdate }: DNDElementsProviderProps) {
  const [a, setA] = useState<number>(0);
  useEffect(() => {
    forceUpdate();
  }, [a]);

  return (
    <DNDElementsContext.Provider value={[programData, setA]}>
      {/* <FlatList data={programData.content} renderItem={}></FlatList> */}
      {/* <FunctionBlock item={programData}></FunctionBlock> */}
      {createProgramBlock(programData)}

      {/* <Droppable content={[programData]} /> */}
    </DNDElementsContext.Provider>
  );
}

DNDElementsProvider.propTypes = {
  programData: PropTypes.object,
};

export { DNDElementsContext };
