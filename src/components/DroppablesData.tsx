import React, { useContext } from "react";
import PropTypes from "prop-types";

import { ButchObj } from "../Butch/ButchObj";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import createProgramBlock from "../Utilities/ProgramBlockLayout";
import useForceUpdate from "../hooks/useUpdate";

const plug = new ButchObj({}, { __hash: "", k: "" }, { __hash: "", k: "" });
const DNDElementsContext = React.createContext<ButchObj>(plug);

export function useDNDElements() {
  return useContext(DNDElementsContext);
}

interface DNDElementsProviderProps {
  programData: ButchObj;
}

export function DNDElementsProvider({ programData }: DNDElementsProviderProps) {
  const update = useForceUpdate();

  return (
    <DNDElementsContext.Provider value={programData}>
      {/* <FlatList data={programData.content} renderItem={}></FlatList> */}
      {/* <FunctionBlock item={programData}></FunctionBlock> */}
      {createProgramBlock(programData)}
      {/* <Droppable content={programData.content} /> */}
    </DNDElementsContext.Provider>
  );
}

DNDElementsProvider.propTypes = {
  programData: PropTypes.object,
};

export { DNDElementsContext };
