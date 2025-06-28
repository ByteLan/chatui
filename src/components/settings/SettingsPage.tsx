import {CSSProperties} from "react";
import {Anchor, Divider} from "@douyinfe/semi-ui";
import ModelSettings, {ModelSettingsProps} from "./ModelSettings.tsx";
import AboutMe from "./AboutMe.tsx";

interface SettingsPageProps extends ModelSettingsProps{
    styles?: CSSProperties,
}

export default function SettingsPage(props:SettingsPageProps) {
    const defaultStyle:CSSProperties = {
        borderRadius: 12,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        width: '100%',
        overflowY: 'hidden',
        overflowX: 'hidden',
        boxSizing: 'border-box',
    }
    const newStyle = {
        ...defaultStyle,
        ...props.styles,
    }

    // const getContainer = () => {
    //     return document.querySelector('window');
    // };

    return (
        <div style={newStyle}>
            <Anchor
                // offsetTop={100}
                // targetOffset={100} // v>=1.9
                scrollMotion={true}
                defaultAnchor={'#modelSetting'}
                style={{ position: 'absolute', left: '8px', top: '50px', zIndex: 3 }} >
                <Anchor.Link href="#modelSetting" title="模型设置" />
                <Anchor.Link href="#aboutMe" title="关于" />
            </Anchor>
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1,
                gap: 6,
                // padding: 12,
                paddingLeft: 88,
                overflowY: 'auto',
                overflowX: 'hidden',
                boxSizing: 'border-box',
            }}>
                <ModelSettings modelList={props.modelList} refreshModelList={props.refreshModelList}/>
                <Divider margin='12px'/>
                <AboutMe/>
                <Divider margin='12px'/>
            </div>
        </div>
    );
}