import React from 'react';
import { Layout, Button } from "antd";
import {
  FileOutlined, EditOutlined, 
  EyeOutlined, WindowsOutlined, 
  QuestionOutlined, MinusOutlined, 
  PlusOutlined, CloseOutlined 
} from '@ant-design/icons';

const { Header } = Layout;

const AppFrame = () => {
  const handleClick = async (action) => {
    switch (action) {
      case 'File':
      case 'Edit':
      case 'View':
      case 'Window':
      case 'Help':
        console.log(`${action} Clicked - Not Implemented`);
        break;
      case 'maximize':
        window.electron.ipcRenderer.send('maximize')
        break;
      case 'close':
        window.electron.ipcRenderer.send('close')
        break;
      case 'minimize':
        window.electron.ipcRenderer.send('minimize')
        break;
      default:
        break;
    }
  };

  return (
    <Header style={{ backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'space-between' }}>
      <div className="menu">
        <img src='/favicon.ico' alt="Logo" style={{width:'20px', height:'20px', padding:'0px', marginRight:'50px'}}/>
        <Button type='text' onClick={() => handleClick('File')} icon={<FileOutlined />} style={{color:'#050300'}}>File</Button>
        <Button type='text' onClick={() => handleClick('Edit')} icon={<EditOutlined />} style={{color:'#050300'}}>Edit</Button>
        <Button type='text' onClick={() => handleClick('View')} icon={<EyeOutlined />} style={{color:'#050300'}}>View</Button>
        <Button type='text' onClick={() => handleClick('Window')} icon={<WindowsOutlined />} style={{color:'#050300'}}>Window</Button>
        <Button type='text' onClick={() => handleClick('Help')} icon={<QuestionOutlined />} style={{color:'#050300'}}>Help</Button>
      </div>
      <div className="controls">
        {/* Control buttons */}
        <Button type='text' onClick={() => handleClick('minimize')} icon={<MinusOutlined />} style={{color:'#050300', fontSize:'10px', marginRight:'10px'}} />
        <Button type='text' onClick={() => handleClick('maximize')} icon={<PlusOutlined />} style={{color:'#050300', fontSize:'10px', marginRight:'10px'}} />
        <Button type='text' onClick={() => handleClick('close')} icon={<CloseOutlined />} style={{color:'#050300', fontSize:'10px', marginRight:'2px'}} />
      </div>
    </Header>
  );
}

export default AppFrame;
