import React, {useContext, useEffect} from 'react';
import './App.css';
import MainPage from './pages/MainPage';

import {Route, Routes} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "./index";

import Matches from './pages/Matches';



function App() {

    const {store} = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    if (store.isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="App">

            <Routes>
                <Route path="/" element={<MainPage/>}/>
               
                <Route path="/matches" element={<Matches/>}/>

            </Routes>
        </div>
    );
}

export default observer(App);
