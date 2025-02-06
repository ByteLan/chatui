import FullChatApp from './FullChatApp.tsx'
import {useRef, useState} from "react";
import { Splitter } from "antd";



export default function ChatWeb() {
    const [chatSize, setChatSize] = useState([1,0]);
    //使用useRef，类似于创造一个全局变量
    const chatRef = useRef();
    const [rightNode, setRightNode] = useState(<iframe src = "https://www.bytelan.cn" width="100%" height="100%"></iframe>);

    const onSplitterSizeChange = (sizes: number[]) => {
        setChatSize(sizes);
        chatRef.current?.handleResize();
    }

    // return <FullChatApp />
    return <Splitter
        style={{
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
        onResize={onSplitterSizeChange}
    >
        <Splitter.Panel collapsible defaultSize="100%" min="20%">
            <FullChatApp rightNodeFn={setRightNode} innerRef={chatRef} chatSize={chatSize}></FullChatApp>
        </Splitter.Panel>
        <Splitter.Panel collapsible >
            {rightNode}
        </Splitter.Panel>
    </Splitter>
}