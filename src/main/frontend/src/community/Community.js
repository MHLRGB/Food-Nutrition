import React, { useEffect, useState, createContext } from 'react';
import './css/Community_Main.css';
import axios from 'axios';
import Header from '../Header';
import {Link} from "react-router-dom";
import {getTopPopularCommunityRecipes, getTopPopularRecipes} from "../apis/Community_api";

const handleNavRecipe = (id) => {
    window.location.href = `/community/recipe/${id}`;
};

const Community = () => {
    return (
        <div className='document'>
            <Header/>
            <Body/>
        </div>
    );
};

const Body = () => {
    const [topRecipes, setTopRecipes] = useState([]);

    useEffect(() => {
        const fetchTopRecipes = async () => {
            try {
                const data = await getTopPopularRecipes();
                setTopRecipes(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchTopRecipes();
    }, []);

    return (
            <div className='community_body_container'>
                <div className='community_Main_body_center'>
                    <div className='community-box'>
                        <div className='community-group'>
                            <Link to='/community/recipe' className='community-type'>인기 레시피</Link>
                            <div className='community-top-title-group'>
                                {topRecipes.map(topRecipe => (
                                    <div key={topRecipe.id} className='community-top-title' onClick={() => handleNavRecipe(topRecipe.id)}>
                                        {topRecipe.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='community-group'>
                            <Link to='/community/recipe' className='community-type'>최신 레시피</Link>
                        </div>
                        <div className='community-group'>
                            <Link to='/community/recipe' className='community-type'>주간 레시피</Link>
                        </div>
                        <div className='community-group'>
                            <Link to='/community/info_tips' className='community-type'>정보/팁</Link>
                        </div>
                    </div>
                </div>
            </div>
    );
};
export default Community;