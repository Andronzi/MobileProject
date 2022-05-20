import React, { useContext } from "react";
import PropTypes from "prop-types";

import { ButchObj } from "../Butch/ButchObj";
import Droppable from "./Droppable";

const plug = new ButchObj({}, { __hash: "", k: "" });
const DNDElementsContext = React.createContext<ButchObj>(plug);

export function useDNDElements() {
  return useContext(DNDElementsContext);
}

/*
Вместо обработки всех потомков, мы будем передавать в объект уже готовую информацию о блоках.
Контекстом в данном случае будет выступать информация о блоках.
Перерисовка будет происходить после обновления контекста:
если мы добавим блок на экран или изменим положение блока, контекст изменится и весь FlatList перерисуется.
Так как мы используем FlatList, то по идее всё должно быть более или менее оптимизировано.
Однако внутри Droppable-блоков не будет использоваться FlatList, так как каждому списку нужно передать данные,
которые будут отрисовываться => в каждый Droppable-блок нужно будет передать только информацию о его потомках =>
эту информацию нужно будет достать из большого объекта с информацией обо всех блоках, что в целом не сложно,
но уменьшает гибкость блока Droppable и влечёт ненужное копироване данных (но можно и подумать над этим)
*/
interface DNDElementsProviderProps {
  programData: ButchObj;
}

function DNDElementsProvider({ programData }: DNDElementsProviderProps) {
  return (
    <DNDElementsContext.Provider value={programData}>
      <Droppable content={programData.content} />
    </DNDElementsContext.Provider>
  );
}

DNDElementsProvider.propTypes = {
  programData: PropTypes.object,
};

export { DNDElementsContext };
