import React from 'react';
import { View, TextInput, Text, FlatList } from 'react-native';

export type Props = {
  title: string,
  name?: string,
  nameSeq?: string[],
  value?: string | undefined
}

export const Title: React.FC<Props> = ({
  title, name, nameSeq, value
}) => {
  return (
    <View>
        <Text>{title}</Text>
        <TextInput value={name} />
        <FlatList data={nameSeq} renderItem={({ item }) => (
            <TextInput value={item}/>
          )} 
        />

      {value && (<TextInput value={value}/>)}
    </View>
  )
}