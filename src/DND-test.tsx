/**
 * @format
 * @flow strict-local
 */

import React, { useState, useContext, useRef } from "react";
import { View, StyleSheet, ScrollView, FlatList } from "react-native";

import Task from "./Components/Task";
import TasksTitle from "./Components/TasksTitle";
import Colors from "./Config/colors";

const FlatListRefContext = React.createContext<React.RefObject<FlatList> | null>(null);

export function useScrollViewRef(): React.RefObject<FlatList> | null {
  return useContext(FlatListRefContext);
}

const App = () => {
  const [taskList, setTaskList] = useState<Array<{ text: string; id: number }>>([
    { text: "Implement drag and drop 🤯", id: 1 },
    { text: "Do something cool 😎", id: 2 },
    { text: "This block needs to check blocks collision 🤣", id: 3 },
    { text: "👄", id: 4 },
    { text: "🧠🧠🧠", id: 5 },
    { text: "😍🥰😘", id: 6 },
    { text: "❤❤❤", id: 7 },
    { text: "👁👁", id: 8 },
    { text: "👄", id: 9 },
    { text: "🧠🧠🧠", id: 10 },
    { text: "😍🥰😘", id: 11 },
    { text: "❤❤❤", id: 12 },
    { text: "👁👁", id: 13 },
    { text: "👄", id: 14 },
    { text: "🧠🧠🧠", id: 15 },
    { text: "😍🥰😘", id: 16 },
    { text: "❤❤❤", id: 17 },
    { text: "👁👁", id: 18 },
  ]);

  const scrollViewRef = useRef<FlatList>(null);

  return (
    <View style={styles.background}>
      <View style={styles.tasksTitleAndTasks}>
        <TasksTitle />
        <FlatListRefContext.Provider value={scrollViewRef}>
          <FlatList
            ref={scrollViewRef}
            data={taskList}
            renderItem={item => <Task key={item.item.id} text={item.item.text}></Task>}
          />
        </FlatListRefContext.Provider>
        {/* {taskList.map(task => (
          <Task key={task.id} text={task.text}></Task>
        ))} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tasksTitleAndTasks: {
    paddingHorizontal: 20,
    paddingTop: 94,
  },
});

export default App;
