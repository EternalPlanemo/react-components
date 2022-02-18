import React from 'react';
import DropDown from './components/DropDown/DropDown';

function App() {
    return (
        <div className="app">
            <DropDown
                mainElement={<div className='btn'>Main Link</div>}
            >
                <div className='btn'>About</div>
                <div className='btn'>Contact</div>
                <div className='btn'>Help</div>
            </DropDown>
        </div>
    );
}

export default App;
