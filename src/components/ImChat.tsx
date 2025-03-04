import {Attachments, Bubble, Prompts, Sender, Welcome} from "@ant-design/x";
import React, {lazy, useEffect, useRef} from "react";
import {Badge, Button, type GetProp, Space} from "antd";
import {Collapse, MarkdownRender} from "@douyinfe/semi-ui";
import LazyImportSuspense from "@bytelan/silkroad-platform/src/LazyImportSuspense.tsx";
import {
    CloudUploadOutlined,
    CommentOutlined,
    EllipsisOutlined,
    FireOutlined,
    HeartOutlined, PaperClipOutlined,
    ReadOutlined,
    SmileOutlined
} from "@ant-design/icons";

const AnylogicSimulationDemoPage = lazy(() => import("../components/anylogic-simulation-demo/AnylogicSimulationDemoPage.tsx"));
const SimulationStarter = lazy(() => import("@bytelan/silkroad-platform/src/platform-pages/simulation-pages/SimulationStarter.tsx"));

// let setRightNodeFn: ((arg0: JSX.Element) => void) | undefined;
// let exampleSideChangeFn: (() => void) | undefined;
//
// let checkRightSize: (() => void) | undefined;


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

const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
        key: '1',
        description: 'help',
        icon: <FireOutlined style={{color: '#FF4D4F'}}/>,
    },
    {
        key: '2',
        description: '使用指导',
        icon: <ReadOutlined style={{color: '#1890FF'}}/>,
    },
];




export default function ImChat({styles, messageItems, activeKey, checkRightSize, setRightNodeFn, onRequest, exampleSideChangeFn, setDemoButtonNode}: {styles: any, messageItems: { key: string , loading: boolean , role: string , content: string }[], activeKey: string, checkRightSize: (() => void) | undefined, setRightNodeFn: ((arg0: JSX.Element) => void) | undefined, onRequest: (nextContent: string) => void, exampleSideChangeFn: (() => void) | undefined, setDemoButtonNode: ((arg0: JSX.Element) => void) | undefined}) {
    const [inputContent, setInputInputContent] = React.useState('');
    const [headerOpen, setHeaderOpen] = React.useState(false);
    const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
        [],
    );

    const onSubmit = (nextContent: string) => {
        if (!nextContent) return;
        onRequest(nextContent);
        setInputInputContent('');
        console.info("onSubmit, activeKey: "+activeKey);
    };


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    function mdComponentMyButton({children, onClick}){
        return <Button onClick={onClick}> {children} </Button>
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    function mdComponentIFrameButton({children, src}){
        // console.warn("in mdComponentIFrameButton");
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
                    <LazyImportSuspense><SimulationStarter src="demo2" activeConversationKey={activeKey}/></LazyImportSuspense>
                )
            }else{
                setRightNodeFn(
                    <LazyImportSuspense><SimulationStarter src={src} activeConversationKey={activeKey}/></LazyImportSuspense>
                )
            }
        }
        }>{children}</Button>
    }

    const mdxComponentsNoThink = {
        'MyButton':mdComponentMyButton,
        'IFrameButton':mdComponentIFrameButton,
        'AnylogicSimulationDemoButton':mdComponentAnylogicSimulationDemoButton,
        'ExampleSideSheetShow':mdComponentExampleSideSheetShow,
        'AnylogicSimulationDemo2Button':mdComponentSimulationStarter
    }

    function mdThink({children}){
        return (
            <Collapse style={{padding:6}}>
                <Collapse.Panel header="思考过程" itemKey="1">
                    <MarkdownRender raw={children} format="mdx" components={{...MarkdownRender.defaultComponents,...mdxComponentsNoThink}} />
                </Collapse.Panel>
            </Collapse>
        );
    }

    function mdThinking({children}){
        return (
            <Collapse defaultActiveKey="1" style={{padding:6}}>
                <Collapse.Panel header="思考过程" itemKey="1">
                    <MarkdownRender raw={children} format="mdx" components={{...MarkdownRender.defaultComponents,...mdxComponentsNoThink}} />
                </Collapse.Panel>
            </Collapse>
        );
    }

    const mdxComponents = {
        ...mdxComponentsNoThink,
        'Think':mdThink,
        'Thinking':mdThinking
    };

    const semiMarkdownRender = (content?: string) => {
        return <MarkdownRender raw={content} format="mdx" components={{...MarkdownRender.defaultComponents,...mdxComponents}} />
        // return <div>123</div>
    };


    const semiPureMarkdownRender = (content?: string) => {
        return <MarkdownRender raw={content} format="md" />
    };

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

    const attachmentsNode = (
        <Badge dot={attachedFiles.length > 0 && !headerOpen}>
            <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
        </Badge>
    );

    const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
        setAttachedFiles(info.fileList);

    const senderHeader = (
        <Sender.Header
            title="Attachments"
            open={headerOpen}
            onOpenChange={setHeaderOpen}
            styles={{
                content: {
                    padding: 0,
                },
            }}
        >
            <Attachments
                beforeUpload={() => false}
                items={attachedFiles}
                onChange={handleFileChange}
                placeholder={(type) =>
                    type == 'drop'
                        ? { title: 'Drop file here' }
                        : {
                            icon: <CloudUploadOutlined />,
                            title: 'Upload files',
                            description: 'Click or drag files to this area to upload',
                        }
                }
            />
        </Sender.Header>
    );

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
                {mdComponentIFrameButton({children: "弹出BIT邮箱", src: "https://mail.bit.edu.cn/"})}
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
    // const MemoizedBubbleList = React.memo(Bubble.List);

    // const scrollRef = useRef<HTMLDivElement>(null);
    //
    // useEffect(() => {
    //     const scrollElement = scrollRef.current;
    //     if (scrollElement) {
    //         const scrollPosition = scrollElement.scrollTop;
    //         return () => {
    //             scrollElement.scrollTop = scrollPosition;
    //         };
    //     }
    // }, [messageItems]);

    function SenderBar() {
        return (
            <>
                <Prompts styles={{item:{paddingTop:2, paddingBottom:2}}} items={senderPromptsItems} onItemClick={onPromptsItemClick} />
                <Sender
                    value={inputContent}
                    header={senderHeader}
                    onSubmit={onSubmit}
                    onChange={setInputInputContent}
                    prefix={attachmentsNode}
                    loading={false}
                    className={styles.sender}
                />
            </>
        )
    }

    return (
        <>
            <Bubble.List
                items={messageItems.length > 0 ? messageItems : [{ content: placeholderNode, variant: 'borderless' }]}
                roles={roles}
                className={styles.messages}
            />
            <SenderBar></SenderBar>
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
}