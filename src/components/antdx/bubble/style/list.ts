import type { GenerateStyle } from '../../theme/cssinjs-utils.ts';
import type { BubbleToken } from './index.ts';

const genBubbleListStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, padding } = token;
  return {
    [`${componentCls}-list`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: padding,
      overflowY: 'auto',
    },
  };
};

export default genBubbleListStyle;
