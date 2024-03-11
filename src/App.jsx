import Versions from './components/Versions'
//import electronLogo from './assets/electron.svg'
/* import AppFrame from './components/appframe'*/
import {Button} from 'antd'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
    {/* <AppFrame/> */}
      <img alt="logo" className="logo" src='./sic_logo.png' />
      <div className="creator">Powered by Yellow-SiC Development</div>
      <p className="creator">In March 2024, this template has been newly unveiled to the public by software architect Ari Bermeki and is currently in its alpha stage.</p>
      <div className="text">
        Build an Electron app with <span className="react">React</span> and <span className="react">FastAPI</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <Button className="action-a" href="https://www.yellow-sic.com/">
          Documentation
        </Button>
        <br/>
        <Button className="action-b" onClick={ipcHandle}>
          Send IPC
        </Button>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App

