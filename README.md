# ChatUI

融合Ant Design X和Semi Design的AI聊天前端项目

## Antd Bubble 修改

```tsx
//Bubble.tsx

import { isEqual } from 'lodash';

// export default ForwardBubble as ForwardBubbleType;

export default React.memo(ForwardBubble, (prevProps, nextProps) => {
    return (
        isEqual(prevProps.content, nextProps.content) &&
        isEqual(prevProps.loading , nextProps.loading) &&
        isEqual(prevProps.placement , nextProps.placement)
    );
}) as ForwardBubbleType;

```

```text
// package.json

"name": "@ant-design-local/x",
"version": "1.0.6",

```

本项目引用

```text
// package.json

"dependencies": {
    "@ant-design-local/x": "file:../../x",

```

```tsx
// ImChat

import Bubble from "@ant-design-local/x/components/bubble/index.tsx";
```
