import React, {useEffect, useState} from 'react';
import axios from "axios";

import { Route, Routes } from 'react-router-dom';
//import axiosInstance from "/axiosInstance";

const Test = () => {

    const [hello1, setHello1] = useState('');
    const [hello2, setHello2] = useState('');

    useEffect(() => {
        axios.get('/hello1')
            .then((res) => {
                setHello1(res.data);
            })
        axios.post('/hello2')
            .then((res) => {
                setHello2(res.data);
            })
    }, []);

    return (
        <>
            <h2>Test.js입니다.</h2>
            <div>hello1(get) : {hello1}</div>
            <div>hello2(post) : {hello2}</div>
        </>
    );
};

export default Test;