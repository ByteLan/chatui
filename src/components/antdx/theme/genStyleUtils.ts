import { genStyleUtils } from '@ant-design/cssinjs-utils';

import { useXProviderContext } from '../x-provider';
import { useInternalToken } from './useToken.ts';

import type { ComponentTokenMap } from './components.ts';
import type { AliasToken, SeedToken } from './cssinjs-utils.ts';

export const { genStyleHooks, genComponentStyleHook, genSubStyleComponent } = genStyleUtils<
  ComponentTokenMap,
  AliasToken,
  SeedToken
>({
  usePrefix: () => {
    const { getPrefixCls, iconPrefixCls } = useXProviderContext();
    return {
      iconPrefixCls,
      rootPrefixCls: getPrefixCls(),
    };
  },
  useToken: () => {
    const [theme, realToken, hashId, token, cssVar] = useInternalToken();
    return { theme, realToken, hashId, token, cssVar };
  },
  useCSP: () => {
    const { csp } = useXProviderContext();
    return csp ?? {};
  },
  layer: {
    name: 'antdx',
    dependencies: ['antd'],
  },
});
