import Bubble from './Bubble.tsx';
import List from './BubbleList.tsx';

export type { BubbleProps } from './interface.ts';

type BubbleType = typeof Bubble & {
  List: typeof List;
};

(Bubble as BubbleType).List = List;

export default Bubble as BubbleType;
