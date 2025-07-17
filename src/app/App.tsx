import { ZontDeviceList } from './components/DeviceList/DeviceList';

function App() {
  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Мониторинг показателей</h1>
      <ZontDeviceList />
    </div>
  );
}

export default App;
