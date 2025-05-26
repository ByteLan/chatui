import {useState} from 'react';
import { Avatar } from '@douyinfe/semi-ui';
import {Toast, Button} from "@douyinfe/semi-ui";
import {Flex, Modal, Row, Col, Input} from "antd";
import {hostAddr} from "../serverConfig.tsx";
// import Cookies from "js-cookie";


export default function UserBar({onLogin, loginState, loginUserName, setLoginState, setLoginUserName, setTempCkid, avatarSize, style, setChatAppName, setChatAppDescription}:{onLogin:()=>void, loginState:boolean, loginUserName:string|null, setLoginState:(state:boolean)=>void, setLoginUserName:(name:string)=>void, setTempCkid:(ckid:string)=>void, avatarSize?:"large"|"small"|"default", style?:React.CSSProperties, setChatAppName?:(name:string)=>void, setChatAppDescription?:(description:string)=>void}) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmLogoutLoading, setConfirmLogoutLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginOkTint, setLoginOkTint] = useState('');
    const [userNameStatus, setUserNameStatus] = useState('');
    const [passwordStatus, setPasswordStatus] = useState('');
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    // 默认style
    const defaultStyle = {
        color: 'black',
    };
    // 合并默认style和传入的style
    const mergedStyle = {...defaultStyle, ...style};

    function login() {
        setLoginModalOpen(true);
    }

    function handleOk() {
        setUserNameStatus('');
        setPasswordStatus('');
        setLoginOkTint('');
        if(userName === ''||password === ''){
            if (password === ''){
                setPasswordStatus('error');
                setLoginOkTint(' 密码不能为空 ');
            }
            if(userName === ''){
                setUserNameStatus('error');
                setLoginOkTint(' 用户名不能为空 ');
            }
            return;
        }
        // console.log(userName, password);
        setConfirmLoading(true);
        fetch(hostAddr+'auth/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                userName: userName,
                password: password,
            })
        }).then(response => response.json())
            .then(data => {
            setConfirmLoading(false);
            if(data.responseStatus === 'loginSuccess'){
                setLoginModalOpen(false);
                setLoginUserName(data.userName);
                // Cookies.set('localckid', data.setCkid, { expires: 3 });
                setLoginState(true);
                setTempCkid(data.setCkid);
                // console.log(setChatAppName);
                if(setChatAppName&&data.appName&&typeof data.appName == 'string'&&data.appName.length>0){
                    //console.warn(data.appName);
                    setChatAppName(data.appName);
                }
                // console.log(setChatAppDescription);
                if(setChatAppDescription&&data.appDescription&&typeof data.appDescription =='string'&&data.appDescription.length>0){
                    // console.warn(data.appDescription);
                    setChatAppDescription(data.appDescription);
                }
                onLogin();
                const opts = {
                    content: "登录成功！欢迎 "+data.userName+" ！",
                    duration: 3,
                    stack: true,
                    theme: 'light',
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                Toast.success(opts);
                setPassword("");
                setUserName("");
            }else{
                setLoginOkTint("登录失败！检查用户名和密码！");
            }
        })
            .catch((error) => {
                setConfirmLoading(false);
                console.error('Error:', error);
                setLoginOkTint("登录失败！"+error);
            });
        // setLoginModalOpen(false);
    }

    function handleCancel() {
        setLoginModalOpen(false);
    }

    function handleLogoutOk() {
        setConfirmLogoutLoading(true);
        fetch(hostAddr+'auth/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({})
        }).then(response => response.json())
            .then(data => {
                // setConfirmLogoutLoading(false);
                if(data.responseStatus === 'success'){
                    // setLoginModalOpen(false);
                    // setConfirmLogoutLoading(false);
                    const opts = {
                        content: "登出成功！！请重新登录！",
                        duration: 3,
                        stack: true,
                        theme: 'light',
                    };
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Toast.success(opts);
                    // 2秒后刷新页面
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }else{
                    // setConfirmLogoutLoading(false);
                    const opts = {
                        content: "登出失败！！服务器返回异常！正在刷新页面重试！",
                        duration: 3,
                        stack: true,
                        theme: 'light',
                    };
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    Toast.error(opts);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    // setLoginModalOpen(false);
                }
            })
            .catch((error) => {
                // setConfirmLogoutLoading(false);
                console.error('Error:', error);
                const opts = {
                    content: "登出失败！！正在刷新页面重试！",
                    duration: 3,
                    stack: true,
                    theme: 'light',
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                Toast.error(opts);
                // setLoginModalOpen(false);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    }

    function handleLogoutCancel() {
        if(confirmLogoutLoading){
            const opts = {
                content: "正在登出，请稍后......",
                duration: 2,
                stack: true,
                theme: 'light',
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            Toast.info(opts);
        }else{
            setLogoutModalOpen(false);
        }
    }



    function onAvatarClick() {
        if(loginState){
            setLogoutModalOpen(true);
        }else{
            setUserNameStatus('');
            setPasswordStatus('');
            setLoginOkTint('');
            login();
        }
    }

    return (
        <div style={{margin:6}}>
            <Button theme="borderless" icon={
                <Flex align='center'>
                    <Avatar color="light-blue" style={{ margin: 2 }} size={(avatarSize==="large"||avatarSize==="small")?(avatarSize==='large'?'medium':'small'):'default'} >
                        {loginState?loginUserName:'未登录'}
                    </Avatar>
                    <p style={{marginLeft: 4}}>{loginState?loginUserName:'点击登录'}</p>
                </Flex>
            } onClick={onAvatarClick} style={{width:'auto', padding:'4px', height: 'auto', color: mergedStyle.color}}></Button>
            <Modal
                title="登录"
                open={loginModalOpen}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Flex vertical={true}>
                    <Row>
                        <Col flex='80px'>用户名:</Col>
                        <Col flex='auto'><Input status={userNameStatus} value={userName} onChange={(e) => setUserName(e.target.value)}/></Col>
                    </Row>
                    <Row>
                        <Col flex='80px'>密码:</Col>
                        <Col flex='auto'><Input.Password status={passwordStatus} onPressEnter={handleOk} value={password} onChange={(e) => setPassword(e.target.value)}/></Col>
                    </Row>
                    <p style={{color: 'red'}}>{loginOkTint}</p>
                </Flex>
            </Modal>
            <Modal
                title="登出"
                open={logoutModalOpen}
                onOk={handleLogoutOk}
                confirmLoading={confirmLogoutLoading}
                onCancel={handleLogoutCancel}
            >
                <p>您已登录，是否要退出？</p>
            </Modal>
        </div>
    );

}