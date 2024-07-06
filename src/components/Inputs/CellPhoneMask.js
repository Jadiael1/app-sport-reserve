import React, { forwardRef } from "react";
import { View } from "react-native";
import { TextInputMask } from "react-native-masked-text";

export const CellPhoneNumber = forwardRef((props, ref) => {
  return (
    <View>
      <TextInputMask
        type={"cel-phone"}
        placeholder="Telefone"
        inputMode="numeric"
        includeRawValueInChangeText
        ref={ref}
        {...props}
      />
    </View>
  );
});
