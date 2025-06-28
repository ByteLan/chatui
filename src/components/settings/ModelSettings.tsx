import {Button, Table, Tag, Tooltip, Modal, Typography} from "@douyinfe/semi-ui";
import {ModelListItemType} from "../../FullChatApp.tsx";
import {useEffect, useMemo, useState} from "react";
import {IconHelpCircle, IconEdit, IconPlusCircle, IconLink} from "@douyinfe/semi-icons";
import ModelEdit from "./ModelEdit.tsx";
import {modelSettingDocLink} from "../../serverConfig.tsx";

export interface ModelSettingsProps {
    modelList: ModelListItemType[],
    refreshModelList: ()=>void,
}

export default function ModelSettings(props: ModelSettingsProps){
    const onHeaderCell = () => ({
        style: {
            backgroundColor: "var(--semi-color-fill-1)",
        },
    });
    const columns = useMemo(()=>{
        return [
            {
                title: <div style={{display: 'flex', alignItems: 'center'}}>
                    <span>{"排序"}</span>
                    <Tooltip content="最高优先级模型将成为【创建会话】、【未指定模型的API调用】时的默认模型；">
                        <IconHelpCircle style={{color: 'var(--semi-color-text-2)', marginLeft: 4}} />
                    </Tooltip>
                </div>,
                sorter: (a: { sortOrder: number; }, b: { sortOrder: number; }) => (a.sortOrder - b.sortOrder > 0),
                dataIndex: 'sortOrder',
            },
            {
                title: "模型名称",
                dataIndex: 'name',
            },
            {
                title: <div style={{display: 'flex', alignItems: 'center'}}>
                    <span>{"模型Key"}</span>
                    <Tooltip content="用于外部API调用">
                        <IconHelpCircle style={{color: 'var(--semi-color-text-2)', marginLeft: 4}} />
                    </Tooltip>
                </div>,
                dataIndex: 'key',
            },
            {
                title: '协议类型',
                dataIndex: 'type',
                render: (text: string) => {
                    if(text === 'openai'){
                        return <Tooltip content={'标准OpenAI协议'}>
                            <Tag shape='circle' color='green'>OpenAI</Tag>
                        </Tooltip>
                    }else if(text === 'openai-ma1'){
                        return <Tooltip content={'在url末尾添加SessionID'}>
                            <Tag shape='circle' color='cyan'>OpenAI+</Tag>
                        </Tooltip>
                    }else{
                        return <Tooltip content={'未识别协议，谨慎使用'}>
                            <Tag shape='circle' color='red'>未知协议</Tag>
                        </Tooltip>
                    }
                }
            },
            {
                title: '模型描述',
                dataIndex: 'description',
            },
            {
                title: '操作',
                dataIndex: 'key',
                render: (text: string) => {
                    return <div style={{display: 'flex', gap: 8}}>
                        <Tooltip content={'修改'}>
                            <Button icon={<IconEdit/>}
                                    aria-label="修改"
                                    onClick={() => {
                                        setModelKey(text);
                                        setModelMode('edit');
                                        setModalVisible(true);
                                    }}/>
                        </Tooltip>
                    </div>
                }
            }
        ]
    }, []);
    const columnsWithHeaderCell = useMemo(() => {
        return columns.map((column) => {
            return {
                ...column,
                onHeaderCell,
            };
        });
    }, [columns]);
    const pagination = useMemo(
        () => ({
            pageSize: 10,
        }),
        []
    );
    const handleRow = (record, index) => {
        // 给偶数行设置斑马纹
        if (index % 2 === 0) {
            return {
                style: {
                    background: 'var(--semi-color-fill-0)',
                },
            };
        } else {
            return {};
        }
    };
    const [modalVisible, setModalVisible] = useState(false);
    const [modelKey, setModelKey] = useState<string | undefined>(undefined);
    const [modelMode, setModelMode] = useState<'create' | 'edit'>('create');
    useEffect(() => {
        if(!modalVisible){
            props.refreshModelList();
            setModelKey(undefined);
            setModelMode('create');
        }
    }, [modalVisible]);
    return (
        <div id="modelSetting" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2>模型设置</h2>
            <p style={{color:'rgba(var(--semi-grey-9), .62)', margin: 0}}>模型列表与API配置</p>
            <Typography.Text link={{href: modelSettingDocLink, target: "_blank"}} icon={<IconLink />} underline>模型配置文档</Typography.Text>
            <Button type="primary"
                    onClick={() => {
                        setModalVisible(true);
                        setModelMode('create');
                    }}
                    icon={<IconPlusCircle/>}>新增模型</Button>
            <Table columns={columnsWithHeaderCell} dataSource={props.modelList} pagination={pagination} onRow={handleRow}/>
            <ModelEdit mode={modelMode} modalVisible={modalVisible} onModalVisibleChange={setModalVisible} modelKey={modelKey}/>
        </div>
    );
}