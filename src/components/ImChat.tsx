import { Prompts, Welcome} from "@ant-design/x";
import React, {lazy} from "react";
import { Button, type GetProp, Space} from "antd";
import {Collapse, MarkdownRender} from "@douyinfe/semi-ui";
import LazyImportSuspense from "@bytelan/silkroad-platform/src/LazyImportSuspense.tsx";
import {
    // CloudUploadOutlined,
    CommentOutlined,
    EllipsisOutlined,
    FireOutlined,
    HeartOutlined,
    // PaperClipOutlined,
    ReadOutlined,
    SmileOutlined
} from "@ant-design/icons";
// import ImChatTitle from "./ImChatTitle.tsx";
// import ImChatSender from "./ImChatSender.tsx";
import Bubble from "@ant-design-local/x/components/bubble/index.tsx";
const ImChatSender = lazy(() => import("./ImChatSender.tsx"));
const AnylogicSimulationDemoPage = lazy(() => import("../components/anylogic-simulation-demo/AnylogicSimulationDemoPage.tsx"));
const SimulationStarter = lazy(() => import("@bytelan/silkroad-platform/src/platform-pages/simulation-pages/SimulationStarter.tsx"));

import { isEqual } from 'lodash';

import MyTable from "./table.tsx";

let setRightNodeFn: ((arg0: JSX.Element) => void) | undefined;
let exampleSideChangeFn: (() => void) | undefined;
let checkRightSize: (() => void) | undefined;
let activeKeyPublic:string|undefined;

const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
        {icon}
        <span>{title}</span>
    </Space>
);

const openLinkInNewTab = (url:string) => {
    window.open(url, '_blank');
}

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    // {
    //     key: '1',
    //     label: renderTitle(<FireOutlined style={{color: '#FF4D4F'}}/>, '标题'),
    //     description: '描述',
    //     children: [
    //         {
    //             key: '1-1',
    //             description: `引导问题1`,
    //         },
    //         {
    //             key: '1-2',
    //             description: `引导问题2`,
    //         },
    //         {
    //             key: '1-3',
    //             description: `引导问题3`,
    //         },
    //     ],
    // },
    {
        key: '2',
        label: renderTitle(<ReadOutlined style={{color: '#1890FF'}}/>, '评估供应链韧性'),
        description: '我可以帮助你评估供应链韧性，你可以尝试这样问：',
        children: [
            {
                key: '2-1',
                icon: <HeartOutlined/>,
                description: `生成供应链网络结构图`,
            },
            {
                key: '2-2',
                icon: <SmileOutlined/>,
                description: `我要对供应链结构进行仿真`,
            },
            {
                key: '2-3',
                icon: <CommentOutlined/>,
                description: `666`,
            },
        ],
    },
    {
        key: '3',
        label: renderTitle(<FireOutlined style={{color: '#FF4D4F'}}/>, '看这里'),
        description: '点下面按钮',
        children: [
            {
                key: '3-1',
                description: `帮助`,
            },
            {
                key: '3-2',
                description: `使用指导`,
            },
            {
                key: '3-3',
                description: `help`,
            },
        ],
    },
];


// 解决重复渲染BubbleList
const BubbleListMemo = React.memo(({messageItems, styles, roles, placeholderNode}:{messageItems:{
        key: string
        loading: boolean
        role: string
        content: string
    }[], styles:any, roles:any, placeholderNode:any}) => (
    <Bubble.List
        items={messageItems.length > 0 ? messageItems : [{ content: placeholderNode, variant: 'borderless' }]}
        roles={roles}
        className={styles.messages}
    />
), (prevProps, nextProps) => {
    // 只在消息变化时重新渲染
    return isEqual(prevProps.messageItems , nextProps.messageItems);
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentMyButton({children, onClick}){
    return <Button onClick={onClick}> {children} </Button>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentIFrameButton({children, src}){
    // console.warn("in mdComponentIFrameButton");
    // console.warn(setRightNodeFn)
    return <Button onClick={()=> {
        checkRightSize?.()
        if (setRightNodeFn === undefined){
            return
        }
        setRightNodeFn(<iframe src = {src} width="100%" height="100%"></iframe>)
    }}> {children} </Button>
}


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentExampleSideSheetShow({children}){
    return <Button onClick={()=> {
        if (exampleSideChangeFn === undefined){
            return
        }
        exampleSideChangeFn()
    }}>{children}</Button>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentAnylogicSimulationDemoButton({children, src}){
    return <Button onClick={()=> {
        checkRightSize?.()
        if (setRightNodeFn === undefined){
            return
        }
        if(src == null){
            setRightNodeFn(
                <LazyImportSuspense><AnylogicSimulationDemoPage simAddr="https://bytelan.cn/"/></LazyImportSuspense>
            )
        }else{
            setRightNodeFn(
                <LazyImportSuspense><AnylogicSimulationDemoPage simAddr={src}/></LazyImportSuspense>
            )
        }
    }}> {children} </Button>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function mdComponentSimulationStarter({children, src}:{children:any, src:string}){
    return <Button onClick={()=> {
        checkRightSize?.()
        if (setRightNodeFn === undefined){
            return
        }
        if(src == null || src =="") {
            setRightNodeFn(
                <LazyImportSuspense><SimulationStarter src="demo2" activeConversationKey={activeKeyPublic}/></LazyImportSuspense>
            )
        }else{
            setRightNodeFn(
                <LazyImportSuspense><SimulationStarter src={src} activeConversationKey={activeKeyPublic}/></LazyImportSuspense>
            )
        }
    }
    }>{children}</Button>
}

function mdTable({children}:{children:any}){
    return <MyTable>{children}</MyTable>
}

const mdxComponents = {
    'MyButton':mdComponentMyButton,
    'IFrameButton':mdComponentIFrameButton,
    'AnylogicSimulationDemoButton':mdComponentAnylogicSimulationDemoButton,
    'ExampleSideSheetShow':mdComponentExampleSideSheetShow,
    'AnylogicSimulationDemo2Button':mdComponentSimulationStarter,
    'table': mdTable
};

const mdComponents = {
    'table': mdTable
}

const MemoSemiMarkdownRenderMemo = React.memo(({content}:{content?:string}) => (
    <MarkdownRender raw={content} format="mdx" components={{...MarkdownRender.defaultComponents,...mdxComponents}} />
), (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
});


const semiMarkdownRender = (content?: string) => {
    return <MemoSemiMarkdownRenderMemo content={content} />;
    // return <MarkdownRender raw={content} format="mdx" components={{...MarkdownRender.defaultComponents,...mdxComponents}} />
    // return <div>123</div>
};

const MemoSemiPureMarkdownRender = React.memo(({content, openReasoning}:{content?:string, openReasoning?:boolean}) => {
    // 将content中>开头的行提取出来
    if(content!=null && content.length>0){
        const contentArr = content.split("\n");
        let contentReasoning = "";
        let contentOthers = "";
        let i=0;
        for(i=0; i<contentArr.length; i++){
            if(contentArr[i].startsWith(">")){
                contentReasoning += contentArr[i] + "\n";
            }else{
                break;
            }
        }
        if(i>0){
            for(let j=i; j<contentArr.length; j++){
                contentOthers += contentArr[j] + "\n";
            }
            return (
                <>
                    <Collapse defaultActiveKey={openReasoning?"1":undefined}>
                        <Collapse.Panel header="思考过程" itemKey="1">
                            <MarkdownRender raw={contentReasoning} format="md" components={{...MarkdownRender.defaultComponents, ...mdComponents}}/>
                        </Collapse.Panel>
                    </Collapse>
                    <MarkdownRender raw={contentOthers} format="md" components={{...MarkdownRender.defaultComponents, ...mdComponents}}/>
                </>
            )
        }else{
            return <MarkdownRender raw={content} format="md" components={{...MarkdownRender.defaultComponents, ...mdComponents}}/>
        }

    }
    return <MarkdownRender raw={content} format="md" components={{...MarkdownRender.defaultComponents, ...mdComponents}}/>
}, (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
});


const semiPureMarkdownRender = (content?: string) => {
    return <MemoSemiPureMarkdownRender content={content} />;
    // return <MarkdownRender raw={content} format="md" />
};

const semiPureMarkdownRenderProcessing = (content?: string) => {
    return <MemoSemiPureMarkdownRender content={content} openReasoning={true} />;
}


const ImChat = React.memo(function ImChatF({styles, messageItems, activeKey, checkRightSizeF, setRightNodeF, onRequest, exampleSideChangeF, setDemoButtonNode}: {styles: any, messageItems: { key: string , loading: boolean , role: string , content: string }[], activeKey: string, checkRightSizeF: (() => void) | undefined, setRightNodeF: ((arg0: JSX.Element) => void) | undefined, onRequest: (nextContent: string) => void, exampleSideChangeF: (() => void) | undefined, setDemoButtonNode: ((arg0: JSX.Element) => void) | undefined}) {
    checkRightSize = checkRightSizeF;
    setRightNodeFn = setRightNodeF;
    exampleSideChangeFn = exampleSideChangeF;
    activeKeyPublic = activeKey;
    // console.warn(checkRightSizeF,setRightNodeF,exampleSideChangeF);
    // console.warn(checkRightSize,setRightNodeFn,exampleSideChangeFn);

    const roles: GetProp<typeof Bubble.List, 'roles'> = {
        ai: {
            placement: 'start',
            // typing: { step: 300, interval: 1 },
            styles: {
                content: {
                    borderRadius: 16,
                },
            },
            messageRender: semiPureMarkdownRender,
        },
        aiProcessing: {
            placement: 'start',
            // typing: { step: 300, interval: 1 },
            styles: {
                content: {
                    borderRadius: 16,
                },
            },
            messageRender: semiPureMarkdownRenderProcessing,
        },
        local: {
            placement: 'end',
            variant: 'shadow',
            // messageRender: semiPureMarkdownRender,
        },
        aiMdx: {
            placement: 'start',
            // typing: { step: 300, interval: 1 },
            styles: {
                content: {
                    borderRadius: 16,
                },
            },
            messageRender: semiMarkdownRender,
        },
    };

    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
        onRequest(info.data.description as string);
    };


    const placeholderNode = (
        <Space direction="vertical" size={16} className={styles.placeholder}>
            <Welcome
                variant="borderless"
                icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                title="你好，这是一个Chat Demo"
                description="Base on Ant Design, Semi Design."
                extra={
                    <Space>
                        {/*<Button icon={<ShareAltOutlined />} />*/}
                        <Button icon={<EllipsisOutlined />} onClick={()=>openLinkInNewTab("https://www.bytelan.cn/")}/>
                    </Space>
                }
            />
            <Prompts
                title="这是一个默认的提示词面板，发送消息后会自动消失。"
                items={placeholderPromptsItems}
                styles={{
                    list: {
                        width: '100%',
                    },
                    item: {
                        flex: 1,
                    },
                }}
                onItemClick={onPromptsItemClick}
            />
        </Space>
    );

    // const attachmentsNode = (
    //     <Badge dot={attachedFiles.length > 0 && !headerOpen}>
    //         <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
    //     </Badge>
    // );

    // const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
    //     setAttachedFiles(info.fileList);
    //
    // const senderHeader = (
    //     <Sender.Header
    //         title="Attachments"
    //         open={headerOpen}
    //         onOpenChange={setHeaderOpen}
    //         styles={{
    //             content: {
    //                 padding: 0,
    //             },
    //         }}
    //     >
    //         <Attachments
    //             beforeUpload={() => false}
    //             items={attachedFiles}
    //             onChange={handleFileChange}
    //             placeholder={(type) =>
    //                 type == 'drop'
    //                     ? { title: 'Drop file here' }
    //                     : {
    //                         icon: <CloudUploadOutlined />,
    //                         title: 'Upload files',
    //                         description: 'Click or drag files to this area to upload',
    //                     }
    //             }
    //         />
    //     </Sender.Header>
    // );

    // setDemoButtonNode?.(
    //     <>
    //         {/*{mdComponentIFrameButton({children: "弹出主页", src: "https://www.bytelan.cn/"})}*/}
    //         {/*{mdComponentIFrameButton({children: "弹出BIT邮箱", src: "https://mail.bit.edu.cn/"})}*/}
    //         {/*{mdComponentExampleSideSheetShow({children: "弹出示例侧边栏"})}*/}
    //         {/*{mdComponentAnylogicSimulationDemoButton({children: "AnylogicDemo", src: null})}*/}
    //     </>
    // )
    React.useEffect(() => {
        setDemoButtonNode?.(
            <>
                {mdComponentIFrameButton({children: "弹出主页", src: "https://www.bytelan.cn/"})}
                {/*{mdComponentIFrameButton({children: "弹出BIT邮箱", src: "https://mail.bit.edu.cn/"})}*/}
                {mdComponentExampleSideSheetShow({children: "弹出示例侧边栏"})}
                {mdComponentAnylogicSimulationDemoButton({children: "SimulationDemo", src: null})}
                {mdComponentSimulationStarter({children: "SimulationDemo2", src: ""})}
            </>
        );

        return () => {
            // 清理副作用
            setDemoButtonNode?.(<> </>);
        };
    }, [setDemoButtonNode]);




    return (
        <>
            <BubbleListMemo messageItems={messageItems} roles={roles} styles={styles} placeholderNode={placeholderNode}/>
            {/*<Bubble.List*/}
            {/*    items={messageItems.length > 0 ? messageItems : [{ content: placeholderNode, variant: 'borderless' }]}*/}
            {/*    roles={roles}*/}
            {/*    className={styles.messages}*/}
            {/*/>*/}
            <LazyImportSuspense>
                <ImChatSender onRequest={onRequest} activeKey={activeKey} styles={styles} />
            </LazyImportSuspense>
            {/*<Prompts styles={{item:{paddingTop:2, paddingBottom:2}}} items={senderPromptsItems} onItemClick={onPromptsItemClick} />*/}
            {/*<Sender*/}
            {/*    value={inputContent}*/}
            {/*    header={senderHeader}*/}
            {/*    onSubmit={onSubmit}*/}
            {/*    onChange={setInputInputContent}*/}
            {/*    prefix={attachmentsNode}*/}
            {/*    loading={false}*/}
            {/*    className={styles.sender}*/}
            {/*/>*/}
        </>
    )
});

export default ImChat;