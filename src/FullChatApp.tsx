import React, { useEffect } from 'react';
import {
    Attachments,
    Bubble,
    Conversations,
    Prompts,
    Sender,
    Welcome,
    useXAgent,
    useXChat,
} from '@ant-design/x';
import { createStyles } from 'antd-style';
import {
    CloudUploadOutlined,
    CommentOutlined,
    EllipsisOutlined,
    FireOutlined,
    HeartOutlined,
    PaperClipOutlined,
    PlusOutlined,
    ReadOutlined,
    // ShareAltOutlined,
    SmileOutlined,
} from '@ant-design/icons';
import { Badge, Button, type GetProp, Space } from 'antd';
import { MarkdownRender } from '@douyinfe/semi-ui';


const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
        {icon}
        <span>{title}</span>
    </Space>
);

const defaultConversationsItems = [
    {
        key: '1122',
        label: 'Conversations 1',
    },
    {
        key: '1011',
        label: 'Conversations 2',
    }
];

// 隐藏菜单的媒体宽度
const hideMenuMediaWidth = 850;

const useStyle = createStyles(({ token, css }) => {

    return {
        layout: css`
      width: 100%;
      min-width: 300px;
      height: 97vh;
      min-height: 400px;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
        menu: css`
            //@media (min-width: ${hideMenuMediaWidth}px) {

                background: ${token.colorBgLayout}80;
                width: 20%;
                max-width: 300px;
                height: 100%;
                display: flex;
                flex-direction: column;
                border-radius: ${token.borderRadius}px;
            //}
            // @media (max-width: ${hideMenuMediaWidth}px) {
            //     background: ${token.colorBgLayout}80;
            //     width: 0;
            //     visibility: hidden;
            //     height: 100%;
            //     display: flex;
            //     flex-direction: column;
            //     border-radius: ${token.borderRadius}px;
            // }
      
    `,
        conversations: css`
      padding: 0 12px;
      flex: 1;
      overflow-y: auto;
    `,
        chat: css`
      height: 100%;
      width: 80%;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      gap: 16px;
    `,
        messages: css`
      flex: 1;
    `,
        placeholder: css`
      padding-top: 32px;
    `,
        sender: css`
      box-shadow: ${token.boxShadow};
    `,
        logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
        addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
    };
});

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
        key: '1',
        label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, '标题'),
        description: '描述',
        children: [
            {
                key: '1-1',
                description: `引导问题1`,
            },
            {
                key: '1-2',
                description: `引导问题2`,
            },
            {
                key: '1-3',
                description: `引导问题3`,
            },
        ],
    },
    {
        key: '2',
        label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, '评估供应链韧性'),
        description: '我可以帮助你评估供应链韧性，你可以尝试这样问：',
        children: [
            {
                key: '2-1',
                icon: <HeartOutlined />,
                description: `生成供应链网络结构图`,
            },
            {
                key: '2-2',
                icon: <SmileOutlined />,
                description: `我要对供应链结构进行仿真`,
            },
            {
                key: '2-3',
                icon: <CommentOutlined />,
                description: `666`,
            },
        ],
    },
    {
        key: '3',
        label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, '标题'),
        description: '描述',
        children: [
            {
                key: '3-1',
                description: `引导问题1`,
            },
            {
                key: '3-2',
                description: `引导问题2`,
            },
            {
                key: '3-3',
                description: `引导问题3`,
            },
        ],
    },
];

const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
        key: '1',
        description: '热门信息',
        icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    },
    {
        key: '2',
        description: '使用指导',
        icon: <ReadOutlined style={{ color: '#1890FF' }} />,
    },
];


const mdComponents = {};

const semiMarkdownRender = (content?: string) => {
    return <MarkdownRender raw={content} format="md" components={mdComponents} />
};

const roles: GetProp<typeof Bubble.List, 'roles'> = {
    ai: {
        placement: 'start',
        typing: { step: 5, interval: 20 },
        styles: {
            content: {
                borderRadius: 16,
            },
        },
        messageRender: semiMarkdownRender,
    },
    local: {
        placement: 'end',
        variant: 'shadow',
        messageRender: semiMarkdownRender,
    },
};

const FullChatApp = React.forwardRef((props, ref) => {
    // ==================== Style ====================
    const { styles } = useStyle();

    // ==================== State ====================
    const [headerOpen, setHeaderOpen] = React.useState(false);

    const [inputContent, setInputInputContent] = React.useState('');

    const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);

    const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);

    const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
        [],
    );

    const [menuWidth, setMenuWidth] = React.useState('20%');// 初始宽度
    const [chatWidth, setChatWidth] = React.useState('80%');// 初始宽度
    const [menuVisible, setMenuVisible] = React.useState('visible');
    const layoutRef = React.useRef<HTMLDivElement>(null);



    // ==================== Runtime ====================
    const [agent] = useXAgent({
        request: async ({ message }, { onSuccess }) => {
            if (message === 'hello') {
                onSuccess('Hello! How can I help you?');
                // return;
            }
            if (message ==="card"){
                onSuccess("123")
            }

            onSuccess(`# Mock success return.\n\n 1. hello \n 2. nihao \n\n **123** \n You said: ${message}`);

        },
    });

    const { onRequest, messages, setMessages } = useXChat({
        agent,
    });

    useEffect(() => {
        if (activeKey !== undefined) {
            // 这里应该要取历史消息，或者放入一个开场欢迎语
            setMessages([]);
        }
    }, [activeKey]);

    const handleResize = () => {
        if (layoutRef.current) {
            const layoutWidth = layoutRef.current.offsetWidth;
            // 根据.layout的宽度设置menu的宽度逻辑
            if (layoutWidth > hideMenuMediaWidth) {
                setMenuWidth('20%');
                setChatWidth('80%');
                setMenuVisible('visible');
            } else {
                setMenuWidth('0');
                setChatWidth('98%');
                setMenuVisible('hidden');
            }
        }
    };



    React.useImperativeHandle(ref, () => ({
        handleResize
    }))


    useEffect(() => {

        window.addEventListener('resize', handleResize);
        // 初始执行一次
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    // ==================== Event ====================
    const onSubmit = (nextContent: string) => {
        if (!nextContent) return;
        onRequest(nextContent);
        setInputInputContent('');
    };

    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
        onRequest(info.data.description as string);
    };

    const onAddConversation = () => {
        setConversationsItems([
            ...conversationsItems,
            {
                key: `${conversationsItems.length}`,
                label: `New Conversation ${conversationsItems.length}`,
            },
        ]);
        setActiveKey(`${conversationsItems.length}`);
    };

    const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (key) => {
        setActiveKey(key);
    };

    const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
        setAttachedFiles(info.fileList);

    const openLinkInNewTab = (url:string) => {
        window.open(url, '_blank');
    }

    // ==================== Nodes ====================
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

    const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
        key: id,
        loading: status === 'loading',
        role: status === 'local' ? 'local' : 'ai',
        content: message,
    }));

    const attachmentsNode = (
        <Badge dot={attachedFiles.length > 0 && !headerOpen}>
            <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
        </Badge>
    );

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
                    type === 'drop'
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

    const logoNode = (
        <div className={styles.logo}>
            <img
                src="/react.svg"
                draggable={false}
                alt="logo"
            />
            <span>BIT</span>
        </div>
    );

    // ==================== Render =================
    return (
        <div className={styles.layout} ref={layoutRef}>
            <div className={styles.menu} style={{ width: menuWidth, visibility: menuVisible }}>
                {/* 🌟 Logo */}
                {logoNode}
                {/* 🌟 添加会话 */}
                <Button
                    onClick={onAddConversation}
                    type="link"
                    className={styles.addBtn}
                    icon={<PlusOutlined />}
                >
                    New Conversation
                </Button>
                {/* 🌟 会话管理 */}
                <Conversations
                    items={conversationsItems}
                    className={styles.conversations}
                    activeKey={activeKey}
                    onActiveChange={onConversationClick}
                />
            </div>
            <div className={styles.chat} style={{ width: chatWidth}}>
                {/* 🌟 消息列表 */}
                <Bubble.List
                    items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
                    roles={roles}
                    className={styles.messages}
                />

                {/* 🌟 提示词 */}
                <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
                {/* 🌟 输入框 */}
                <Sender
                    value={inputContent}
                    header={senderHeader}
                    onSubmit={onSubmit}
                    onChange={setInputInputContent}
                    prefix={attachmentsNode}
                    loading={agent.isRequesting()}
                    className={styles.sender}
                />
            </div>
        </div>
    );
});

export default FullChatApp
