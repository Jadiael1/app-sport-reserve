import React, { forwardRef } from "react";
import { View } from "react-native";
import { TextInputMask } from "react-native-masked-text";

const DateTime = forwardRef((props, ref) => {
  return (
    <View>
      <TextInputMask
        type={"datetime"}
        options={{
          format: "DD/MM/YYYY",
        }}
        placeholder="Digite a data"
        inputMode="number-pad"
        includeRawValueInChangeText
        ref={ref}
        {...props}
      />
    </View>
  );
});

export default DateTime;
