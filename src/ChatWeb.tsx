import FullChatApp from './FullChatApp.tsx'
import {useRef, useState} from "react";
import { Splitter } from "antd";
import {IllustrationNoContent, IllustrationNoContentDark} from "@douyinfe/semi-illustrations";
import {Empty} from "@douyinfe/semi-ui";



export default function ChatWeb() {
    const [chatSizeConst, setChatSizeConst] = useState([1,0]);
    const [chatSize, setChatSize] = useState<number|string>('100%');
    //使用useRef，类似于创造一个全局变量
    const chatRef = useRef();
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

    const onSplitterSizeChange = (sizes: number[]) => {
        console.warn("onSplitterSizeChange: "+sizes);
        setChatSizeConst(sizes);
        setChatSize(sizes[0]);
        chatRef.current?.handleResize();
    }

    // return <FullChatApp />
    return (
        <div style={{height: '100%', width: 'calc(100% - 6px)',}}>
            <Splitter
                style={{
                    // boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                    width: '100%',
                }}
                onResize={onSplitterSizeChange}
            >
                <Splitter.Panel collapsible size={chatSize} defaultSize="100%" min="20%">
                    <FullChatApp rightNodeFn={setRightNode} innerRef={chatRef} chatSizeConst={chatSizeConst} setChatSize={setChatSize} chatSize={chatSize}></FullChatApp>
                </Splitter.Panel>
                <Splitter.Panel collapsible style={{overflow: 'auto', height: '100%', width: '100%'}}>
                    {rightNode}
                </Splitter.Panel>
            </Splitter>
        </div>
    );

}