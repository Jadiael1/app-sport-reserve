import React, { forwardRef } from "react";
import { View } from "react-native";
import { TextInputMask } from "react-native-masked-text";

const CpfMask = forwardRef((props, ref) => {
  return (
    <View>
      <TextInputMask
        type={"cpf"}
        placeholder="CPF"
        inputMode="numeric"
        includeRawValueInChangeText
        ref={ref}
        {...props}
      />
    </View>
  );
});

export default CpfMask;
