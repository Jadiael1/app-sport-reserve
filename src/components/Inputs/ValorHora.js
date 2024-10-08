import React, { forwardRef } from "react";
import { View, TextInput } from "react-native";
import { TextInputMask } from "react-native-masked-text";

export const ValorHora = forwardRef((props, ref) => {
  return (
    <View>
      <TextInputMask
        type={"money"}
        placeholder="Valor da hora"
        inputMode="numeric"
        includeRawValueInChangeText={true}
        ref={ref}
        {...props}
      />
    </View>
  );
});
