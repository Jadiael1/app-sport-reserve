import React, { forwardRef } from "react";
import { View } from "react-native";
import { TextInputMask } from "react-native-masked-text";

export const ValorHora = forwardRef((props, ref) => {
  return (
    <View>
      <TextInputMask
        type={"money"}
        placeholder="Valor da hora"
        keyboardType="numeric"
        includeRawValueInChangeText
        ref={ref}
        {...props}
      />
    </View>
  );
});


