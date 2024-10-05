/**
 * SVG ファイルを React コンポーネントとしてインポートするための型定義
 *
 * このモジュールは、SVG ファイルを React コンポーネントとして扱うための型を提供します。
 *
 * @module
 * @see https://github.com/software-mansion/react-native-svg
 */
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
