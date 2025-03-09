import React, {lazy} from 'react';
import {Resizable} from "@douyinfe/semi-ui";
import {VChartLineData} from "./DemoData.tsx";
import LazyImportSuspense from "@bytelan/silkroad-platform/src/LazyImportSuspense.tsx";
// import VChart from '@visactor/react-vchart';
const VChart = lazy(() => import('@visactor/react-vchart').then(module => ({ default: module.VChart })));

export default function MessageCardVChart({title, dataSrc, style={}, children}: {title?: string, dataSrc?: string, style?:React.CSSProperties, children?:any}) {
    console.log(dataSrc);
    const defaultStyle:React.CSSProperties = {height: '250px', width: '300px', minWidth:'50px', minHeight:'50px', padding: 4, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(var(--semi-grey-5), 1)', borderRadius: 4};
    const newStyle = {...defaultStyle, ...style};
    const sizeStyle = {height: newStyle.height, width: newStyle.width};

    return <Resizable defaultSize={sizeStyle} style={newStyle}>

        {dataSrc?(
            <LazyImportSuspense style={{height: 'calc(100% - 32px)', width: 'calc(100% - 8px)'}}>
                <VChart spec={VChartLineData} style={{height: title?'calc(100% - 36px)':'100%', width: '100%'}}/>
            </LazyImportSuspense>
        ):(
            <div style={{fontSize: 16, fontWeight:'bold', textAlign: 'center', justifyContent: 'center', width:"100%"}}>数据参数异常！</div>
        )}
        {title?<div style={{fontSize: 16, marginTop: 10, color: 'grey', textAlign: 'center', justifyContent: 'center', width:"100%"}}>{title}</div>:<></>}
    </Resizable>;
}