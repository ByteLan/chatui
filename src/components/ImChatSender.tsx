import {Attachments, Prompts, Sender} from "@ant-design/x";
import {Badge, Button, GetProp} from "antd";
import {CloudUploadOutlined, FireOutlined, PaperClipOutlined, ReadOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";


const defaultPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
        key: '1',
        description: '生成供应链仿真环境',
        icon: <FireOutlined style={{color: '#FF4D4F'}}/>,
    },
    {
        key: '2',
        description: '使用指导',
        icon: <ReadOutlined style={{color: '#1890FF'}}/>,
    },
];

export default function ImChatSender({senderPromptsItems, onRequest, activeKey, styles}:{senderPromptsItems?: {key:string, description:string}[], onRequest:(content:string)=>void, activeKey:string, styles:any}) {
    const [showPrompts, setShowPrompts] = React.useState(false);
    const [promptsItems, setPromptsItems] = React.useState(defaultPromptsItems);
    const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
        [],
    );
    const [inputContent, setInputInputContent] = React.useState('');
    const [headerOpen, setHeaderOpen] = React.useState(false);
    useEffect(() => {
        if(senderPromptsItems == null||senderPromptsItems.length<=0){
            setShowPrompts(true);
            setPromptsItems(defaultPromptsItems);
        }else{
            setShowPrompts(true);
            setPromptsItems(senderPromptsItems.map((item)=>{return {key:item.key, description:item.description, icon:<FireOutlined style={{color: '#FF4D4F'}}/>}}));
        }
    }, [senderPromptsItems]);

    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
        onRequest(info.data.description as string);
    };

    const onSubmit = (nextContent: string) => {
        if (!nextContent) return;
        onRequest(nextContent);
        setInputInputContent('');
        console.info("onSubmit, activeKey: "+activeKey);
    };

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

    return (
        <>
            {showPrompts?<Prompts styles={{item:{paddingTop:2, paddingBottom:2}}} items={promptsItems} onItemClick={onPromptsItemClick} />:<></>}
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