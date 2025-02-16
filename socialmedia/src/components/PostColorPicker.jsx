import React, { useState } from 'react';
import { generate, green, presetPalettes, red } from '@ant-design/colors';
import { ColorPicker, theme } from 'antd';
function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}
const PostColorPicker = ({className ,onChangeComplete}) => {
  const { token } = theme.useToken();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const presets = genPresets({
    Ready_Colors: [
      '#FF9800',
      '#00C853',
      '#607D8B',
      '#1369e0',
      '#dfef3a',
      '#f84936',
    ], // Linear gradient colors
  });

  return <ColorPicker
          onChangeComplete={onChangeComplete}
          className={` h-fit self-center ${className} `}
          presets={presets}
          defaultValue="#1677ff"
          
        />

        

};
export default PostColorPicker;