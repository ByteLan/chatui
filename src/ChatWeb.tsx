import FullChatApp from './FullChatApp.tsx'
import {useRef, useState} from "react";
import { Splitter } from "antd";



export default function ChatWeb() {
    const [chatSizeConst, setChatSizeConst] = useState([1,0]);
    const [chatSize, setChatSize] = useState<number|string>('100%');
    //使用useRef，类似于创造一个全局变量
    const chatRef = useRef();
    const [rightNode, setRightNode] = useState(<iframe src = "https://www.bytelan.cn" width="100%" height="100%"></iframe>);

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
                <Splitter.Panel collapsible >
                    {rightNode}
                </Splitter.Panel>
            </Splitter>
        </div>
    );

}