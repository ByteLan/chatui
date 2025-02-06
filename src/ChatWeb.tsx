import FullChatApp from './FullChatApp.tsx'
import {useRef, useState} from "react";
import { Splitter } from "antd";



export default function ChatWeb() {
    const [chatSize, setChatSize] = useState([1,1]);
    const chatRef = useRef();

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
            <FullChatApp ref={chatRef}></FullChatApp>
        </Splitter.Panel>
        <Splitter.Panel collapsible >
            <iframe src = "https://www.bytelan.cn" width="100%" height="100%"></iframe>
        </Splitter.Panel>
    </Splitter>
}