import {useEffect, useRef, useState} from 'react'
import {
    theme,
    Menu,
    Button,
    Flex,
    Splitter,
    Layout,
    Input,
    Collapse,
    Progress,
    Slider,
    type SliderSingleProps,
    FloatButton,
    Divider,
    Modal,
    Radio,
    Popconfirm,
} from 'antd';
import {Toast, Typography} from '@douyinfe/semi-ui';
import SimDataShowContent from './components/SimDataShowContent.tsx';
import {demoDataShowMenuItems, demoSimDataShowItems, demoSimsData} from './assets/demoData.tsx';

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';

// import test_sim from "./assets/test_sim.png";

const {Header, Sider, Content} = Layout;


function showToastError(content: string): void {
    const opts = {
        content: content,
        duration: 0,
        stack: true,
        theme: 'light',
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    Toast.error(opts);

}

const speedMarks: SliderSingleProps['marks'] = {
    0: '1x',
    15: '10x',
    30: '100x',
    60: '200x',
    100: 'max',
}



function AnylogicSimulationDemoPage({simAddr}: { simAddr: string | null }) {
    // const [wsState, setWsState] = useState('未连接');
    const [simState, setSimState] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const [changeFunctionMenuEnable, setchangeFunctionMenuEnable] = useState(true);
    const [dataShowMenuItems, setDataShowMenuItems] = useState(demoDataShowMenuItems);
    const [dataShowMenuItemsSelectedId, setDataShowMenuItemsSelectedId] = useState(0);
    const [simDataShowItems, setSimDataShowItems] = useState(demoSimDataShowItems);

    const [simsData, setSimsData] = useState(demoSimsData);
    const [simsDataChosenId, setSimsDataChosenId] = useState('1');
    const [simsDataID, setSimsDataID] = useState('1');
    const [isSimsDataChooseModelOpen, setIsSimsDataChooseModelOpen] = useState(false);

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const functionMenuItems = [
        {
            key: '0',
            label: '供应链韧性分析',
            introduction: '分析供应链韧性',
            dataRequest: [],
        },
        {
            key: '1',
            label: '替代供应商分析',
            introduction: '通过仿真，找出替代供应商，您需要提供中断节点。',
            dataRequest: [
                {
                    type: 'Text',
                    title: '中断企业名称',
                    data: '',
                },
            ],
        },
        {
            key: '2',
            label: '供应链结构分析',
            introduction: '敬请期待......',
            dataRequest: [],
        },
    ];


    // 使用 useRef 存储 socket 对象
    // const socketRef = useRef<WebSocket | null>(null);

    // useEffect(() => {
    //     console.info("useEffect");
    //     if (portString == null) {
    //         console.error('port is not set');
    //         showToastError("服务端口未指定，请检查！");
    //     } else {
    //         console.info("io start");
    //         socketRef.current = new WebSocket(`ws://localhost:${portString}/websocket`);
    //         console.info("io set");
    //         socketRef.current.addEventListener('connect', () => {
    //             setWsState('已连接');
    //         });
    //         console.info("on connect set");
    //         socketRef.current.addEventListener('disconnect', () => {
    //             setWsState('重连中');
    //             socketRef.current = null;
    //         });
    //         console.info("on disconnect set");
    //         socketRef.current.addEventListener('message', (data) => {
    //             console.info(data);
    //             // try{
    //             //     const jo = JSON.parse(data);
    //             //     if(jo.has('responseType') && jo['responseType'] === 'startEngine' && jo['status'] === 'success'){
    //             //         setSimState('已启动');
    //             //     }else if(jo.has('responseType') && jo['responseType'] === 'stopEngine' && jo['status'] === 'success'){
    //             //         setSimState('已重置');
    //             //     }
    //             // }catch (e) {
    //             //     console.error(e);
    //             // }
    //
    //         });
    //         console.info("on message set");
    //         socketRef.current.addEventListener('error', (error) => {
    //             console.log(error);
    //             setWsState('连接错误');
    //             socketRef.current = null;
    //         });
    //         console.info("on error set");
    //     }
    //
    //
    //     return () => {
    //         socketRef.current?.close()
    //         socketRef.current = null;
    //     }
    // }, [portString]);
    //
    // const clickStart = () => {
    //     console.log(functionMenuItems);
    //     if (socketRef.current == null) {
    //         showToastError("未连接到服务器，请检查！");
    //         return;
    //     }
    //     socketRef.current.send("{\"requestType\":\"startEngine\"}");
    // }
    //
    // const clickReset = () => {
    //     if (socketRef.current == null) {
    //         showToastError("未连接到服务器，请检查！");
    //         return;
    //     }
    //     socketRef.current.send("{\"requestType\":\"stopEngine\"}");
    //
    // }

    function FunctionMenuInputData({dataRequest}: { dataRequest: { type: string, title: string, data: string }[] }) {
        const result: JSX.Element[] = [];
        dataRequest.map((item) => {
            if (item.type === 'Text') {
                result.push(
                    <div>
                        <Input addonBefore={item.title} onChange={(i) => {
                            item.data = i.target.value;
                        }}/>
                    </div>
                );
            }
        });
        return (
            <div>
                {result}
            </div>
        )
    }

    function FunctionMenuItem({introduction, dataRequest}: {
        introduction: string,
        dataRequest: { type: string, title: string, data: string }[]
    }) {
        return (
            <div>
                <Flex vertical={true} style={{padding: 4}}>
                    <p style={{margin: '0px 0px'}}>{introduction}</p>
                    <FunctionMenuInputData dataRequest={dataRequest}></FunctionMenuInputData>
                </Flex>
            </div>
        );
    }


    const functionMenuItemsInput = functionMenuItems.map((item) => {
        return {
            key: item.key,
            label: item.label,
            children: <FunctionMenuItem introduction={item.introduction} dataRequest={item.dataRequest}/>,
        }
    });

    const onChangeFunctionMenu = (key: string[]) => {
        console.log(key);
    }


    function handleSimsDataChooseModelOk() {
        setIsSimsDataChooseModelOpen(false);
        setSimsDataID(simsDataChosenId);
        //TODO: 选择实验后的操作，下载实验数据
    }

    function deleteSimData() {
        setSimsDataID('');
    }

    function AnylogicIframe({simAddr}: {simAddr:string}) {
        return (
            <div style={{height: '100%', width: '100%', overflow: 'hidden', border: 0 }}>
                <div style={{height: 'calc(100% + 50px)', width: '100%'}}>
                    <iframe src={simAddr} width='100%' height='100%'></iframe>
                </div>

            </div>

        );
    }

    return (
        // <div style={{ height: 'calc(99vh - 30px)' , width: 'calc(99vw - 10px)'}}>
        // <div style={{height: '100%', width: '100%'}}>
        <div>
            <Flex align='center' style={{height: 64}}>
                <Typography.Title heading={2} style={{marginLeft: 16}}>供应链韧性仿真平台</Typography.Title>
            </Flex>

            {/*<div style={{height: 'calc(100% - 64px)'}}>*/}
            <div >
                <Splitter style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}} layout="vertical">
                    <Splitter.Panel min='10%' defaultSize='30%'>
                        {simAddr == null ? <></> : <AnylogicIframe simAddr={simAddr}/>}
                    </Splitter.Panel>
                    {/*上方布局*/}
                    <Splitter.Panel min='10%' defaultSize='13%'>
                        <Splitter layout="horizontal">
                            {/*左侧布局：仿真控制*/}
                            <Splitter.Panel min={250} defaultSize='35%'>
                                <Flex vertical={true} style={{padding: 10}}>
                                    <Collapse collapsible={changeFunctionMenuEnable ? 'header' : 'disabled'} accordion
                                              onChange={onChangeFunctionMenu} items={functionMenuItemsInput}/>

                                </Flex>

                            </Splitter.Panel>
                            <Splitter.Panel min='10%'>
                                <Flex vertical={true} style={{padding: 10}}>
                                    <Typography.Title heading={5}>仿真速度：</Typography.Title>
                                    <Slider marks={speedMarks} defaultValue={15} included={false} step={null}
                                            tooltip={{formatter: null}}/>


                                    <Divider style={{margin: '10px 0'}}/>

                                    <Typography.Title heading={5}>仿真进度：{simState}</Typography.Title>
                                    <Progress percent={0} size="small" status="active"/>

                                    <Divider style={{margin: '10px 0'}}/>

                                    <Flex justify='space-evenly' style={{width: '100%'}}>
                                        <Button type="primary" >开始</Button>
                                        <Button type="primary" >重置</Button>
                                    </Flex>
                                </Flex>



                                {/*<img alt='Anylogic仿真界面' src={test_sim} width="98%" height="98%"></img>*/}

                            </Splitter.Panel>
                        </Splitter>
                    </Splitter.Panel>
                    {/*下方布局*/}
                    <Splitter.Panel min='10%'>
                        <div style={{height: '100%', width: '100%'}}>
                            {/*判断是仿真开始前还是仿真开始后，显示不同的内容*/}
                            <Modal title="选择您进行过的实验" open={isSimsDataChooseModelOpen}
                                   onOk={handleSimsDataChooseModelOk} onCancel={() => setIsSimsDataChooseModelOpen(false)}>
                                <Radio.Group
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                    }}
                                    onChange={(e) => {
                                        setSimsDataChosenId(e.target.value);
                                    }}
                                    value={simsDataChosenId}
                                    options={simsData}
                                />
                            </Modal>
                            <Layout style={{height: '100%'}}>
                                <Sider trigger={null} collapsible collapsed={collapsed}
                                       style={{backgroundColor: 'white', overflow: 'auto'}}>
                                    <Button type={'primary'}
                                            style={{height: '30px', width: '96%', marginTop: '9px', marginLeft: '2%'}}
                                            onClick={() => setIsSimsDataChooseModelOpen(true)}>选择实验</Button>
                                    {
                                        (simsDataID != '' && dataShowMenuItems.length > 0) ?
                                            <div>
                                                <Menu
                                                    theme="light"
                                                    mode="inline"
                                                    defaultSelectedKeys={['1']}
                                                    items={dataShowMenuItems}
                                                    style={{marginTop: '9px'}}
                                                />
                                                <Popconfirm
                                                    title="确认删除该实验数据？"
                                                    description="删除后无法恢复，请注意导出保存。"
                                                    onConfirm={deleteSimData}
                                                    onCancel={() => {
                                                    }}
                                                    okText="确定"
                                                    cancelText="取消"
                                                >
                                                    <Button type={'primary'} style={{
                                                        height: '25px',
                                                        width: '96%',
                                                        marginTop: '16px',
                                                        marginLeft: '2%'
                                                    }} danger>删除实验</Button>
                                                </Popconfirm>
                                            </div>
                                            :
                                            <div>
                                                <Typography.Title heading={5}>请先选择实验</Typography.Title>
                                            </div>
                                    }


                                </Sider>
                                <Layout>
                                    <Header style={{padding: 0, background: colorBgContainer, height: 48}}>
                                        <Flex align='center'>
                                            <Button
                                                type="text"
                                                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                                onClick={() => setCollapsed(!collapsed)}
                                                style={{
                                                    fontSize: '16px',
                                                    width: 48,
                                                    height: 48,
                                                }}
                                            />
                                            <Typography.Title heading={4}>仿真数据面板 </Typography.Title>
                                        </Flex>

                                    </Header>
                                    <Content
                                        style={{
                                            margin: '12px 12px',
                                            padding: 6,
                                            minHeight: 280,
                                            background: colorBgContainer,
                                            borderRadius: borderRadiusLG,
                                        }}
                                    >
                                        <SimDataShowContent simDataShowItems={demoSimDataShowItems}/>
                                    </Content>
                                </Layout>
                            </Layout>
                        </div>


                    </Splitter.Panel>
                </Splitter>
            </div>

        </div>
    )
}

export default AnylogicSimulationDemoPage
