import { Typography } from '@douyinfe/semi-ui';
import { IconLink } from '@douyinfe/semi-icons';
import {
    footerCopyrightText, footerGongWangAnBeiLink, footerGongWangAnBeiText, footerIcpLink,
    footerIcpText,
    homePageLink, homePageLinkText,
    modelSettingDocLink,
    todoDocLink
} from "../../serverConfig.tsx";


export default function AboutMe(){
    const { Text } = Typography;
    return (
        <div id="aboutMe" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2>关于</h2>
            <p style={{color:'rgba(var(--semi-grey-9), .62)', margin: 0}}>帮助文档</p>
            <Text link={{href: todoDocLink, target: "_blank"}} icon={<IconLink />} underline>帮助文档汇总与开发进展</Text>
            {/*<Text link={{href: modelSettingDocLink, target: "_blank"}} icon={<IconLink />} underline>模型配置文档</Text>*/}
            <span></span>
            <span><p style={{ margin: 0}}>{footerCopyrightText}</p></span>
            <span><a id='footer-icp-a' href={footerIcpLink} target="_blank" rel="noopener noreferrer">{footerIcpText}</a></span>
            <span><a id='footer-icp-a' href={footerGongWangAnBeiLink} target="_blank" rel="noopener noreferrer">{footerGongWangAnBeiText}</a></span>
            <Text link={{href: homePageLink, target: "_blank"}} icon={<IconLink />} underline>{homePageLinkText}</Text>
        </div>
    )

}