// import FullChatApp from './FullChatApp.tsx'
import {useRef, useState, lazy, useCallback} from "react";
import { Splitter } from "antd";
import {IllustrationNoContent, IllustrationNoContentDark} from "@douyinfe/semi-illustrations";
import {Empty, Spin} from "@douyinfe/semi-ui";
import LazyImportSuspense from "@bytelan/silkroad-platform/src/LazyImportSuspense.tsx";
import { Watermark } from '@arco-design/web-react';

const FullChatApp = lazy(() => import('./FullChatApp.tsx'));



export default function ChatWeb() {
    const [chatSizeConst, setChatSizeConst] = useState([1,0]);
    const [chatSize, setChatSize] = useState<number|string>('100%');
    const [subPageSize, setSubPageSize] = useState<number|string>('0%');
    const [waterMarkText, setWaterMarkText] = useState<string>('【BIT】');
    //使用useRef，类似于创造一个全局变量
    // 定义 chatRef 的类型，确保其 current 属性可能有 handleResize 方法
    const chatRef = useRef<{ handleResize: () => void } | null>(null);
    const [rightNode, setRightNode] = useState(
        <Empty image={<IllustrationNoContent style={{ width: 300 }} />}
               darkModeImage={<IllustrationNoContentDark style={{ width: 300 }} />}
               title="多模态交互页">
            <div style={{width: 400 }}>
                <p>这里是多模态交互页，您可以通过左右页面之间的分隔栏调整大小。</p>
                <p>左侧为多智能体 Chat 界面，右侧为多模态交互界面。</p>
                <h3>交互说明</h3>
                <p>当您在左侧 Chat 中触发特定功能，可以在右侧展开对应交互界面。</p>
                <p>  例如：当您在 Chat 中输入“生成供应链仿真环境”，智能体会向您返回打开右侧仿真的按钮。</p>
                <p>您在右侧使用的功能，会在必要时向您左侧的 Chat 中发送分析结果等信息，请留意。</p>
            </div>

        </Empty>);

    const onSplitterSizeChange = useCallback((sizes: number[]) => {
        // console.warn("onSplitterSizeChange: "+sizes);
        setChatSizeConst(sizes);
        setChatSize(sizes[0]);
        setSubPageSize(sizes[1]);
        chatRef.current?.handleResize();
    }, []);

    const setRightNodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const setRightNodeDelay = useCallback((node: JSX.Element) => {
        setRightNode(<Spin style={{height:'100%', width:'100%'}} tip="加载中......" size="large"></Spin>);
        if (setRightNodeTimeoutRef.current) {
            clearTimeout(setRightNodeTimeoutRef.current);
        }
        setRightNodeTimeoutRef.current = setTimeout(() => {
            setRightNode(node);
        }, 600);
    }, []);

    const setWatermark = useCallback((text:string)=>{
        setWaterMarkText(text);
    },[]);

    // return <FullChatApp />
    return (
        <div style={{height: '100%', width: 'calc(100% - 6px)', overflow: 'hidden'}} className={`semi-light-scrollbar`} >
            <Splitter
                style={{
                    // boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                    width: '100%',
                }}
                onResize={onSplitterSizeChange}
            >
                <Splitter.Panel collapsible size={chatSize} defaultSize="100%" min={320} style={{overflow:"hidden"}}>
                    <LazyImportSuspense>
                        <FullChatApp setWatermark={setWatermark} rightNodeFn={setRightNodeDelay} innerRef={chatRef} chatSizeConst={chatSizeConst} setChatSize={setChatSize} chatSize={chatSize} setSubPageSize={setSubPageSize}></FullChatApp>
                    </LazyImportSuspense>
                </Splitter.Panel>
                <Splitter.Panel collapsible defaultSize='0%' size={subPageSize} style={{overflow: 'hidden', height: '100%', width: '100%', backgroundColor: 'rgba(var(--semi-indigo-0), 1)'}}>
                    <div style={{overflow: 'auto', marginTop: 6, marginBottom: 6, marginLeft: 6, marginRight: 6,boxSizing: 'border-box', height: 'calc(100% - 12px)', width: 'calc(100% - 12px)', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 0 6px rgba(var(--semi-grey-2), 1)'}}>
                        {rightNode}
                    </div>
                </Splitter.Panel>
            </Splitter>
            <Watermark content={waterMarkText} getContainer={() => document.querySelector("#ChatRoot")} fontStyle={{fontSize:10}} gap={[150,200]}/>
        </div>
    );

}