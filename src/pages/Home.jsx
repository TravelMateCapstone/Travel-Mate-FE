import React from 'react';
import ToolBar from '../components/Shared/ToolBar';
import sunny from '../assets/images/sunny.png'

function Home() {
  return (
    <div>
      <ToolBar />

      <div className='d-flex justify-content-between gap-3 flex-wrap mt-3' style={{
        padding: '0 85px'
      }}>
        <div style={{
          flex: 1
        }}>
          
          <div className='weather-wildet bg-success text-white p-2'>
            <h4 className='text-center'>Hồ Chí Minh</h4>
           <div className='d-flex align-items-center'>
              <div>
                <p className='text-nowrap'><ion-icon name="cloud-outline"></ion-icon> 13km/h</p>
                <p><ion-icon name="water-outline"></ion-icon> 20%</p>
              </div>
              <img src={sunny} alt="sunny" width={128}/>
              <div>
                <p><ion-icon name="thermometer-outline"></ion-icon> 30<sup>o</sup>C</p>
                <p className='text-nowrap'>Nắng ấm</p>
              </div>
           </div>
          </div>

        </div>
        <div style={{
          flex: 3
        }}>Body</div>
        <div style={{
          flex: 1
        }}>Right</div>
      </div>

    </div>
  );
}

export default Home;
