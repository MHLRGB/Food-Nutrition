// SelectCategory.js
import React, {useEffect, useState} from 'react';
import '../css/Main.css';
import {nowUserInfo, saveUser} from '../apis/User_api';

const SelectCategory = () => {
    return (
        <div className='document'>
            <Body />
        </div>
    );
};

const Body = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [username, setUsername] = useState(''); // 사용자 이름을 입력받거나 설정할 상태 추가

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 레시피 데이터 가져오기
                const response = await nowUserInfo();
                setUsername(response.id);

            } catch (error) {
                console.log("Error : " + error);
            }
        };

        fetchData();
    }, []);

    const handleCategoryClick = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(item => item !== category));
        } else {
            if (selectedCategories.length >= 3) {
                setSelectedCategories([...selectedCategories.slice(1), category]);
            } else {
                setSelectedCategories([...selectedCategories, category]);
            }
        }
    };

    const handleSubmit = async () => {
        const [cat1, cat2, cat3] = selectedCategories;
        try {
            const response = await saveUser(username, cat1, cat2, cat3);
            console.log("Response:", response);
            window.location.href = '/';
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const categories = [
        "밑반찬", "메인반찬", "디저트", "손님접대", "술안주", "다이어트", "영양식", "간식",
        "도시락", "야식", "해장", "이유식", "소고기", "돼지고기", "닭고기", "채소류",
        "해물류", "가공식품류", "튀김", "회"
    ];

    const categoryRows = [];
    for (let i = 0; i < categories.length; i += 5) {
        categoryRows.push(categories.slice(i, i + 5));
    }

    return (
        <div className="select_body_container">
            <h3                                    style={{
                marginTop:'150px',
                fontWeight:'bold',
                fontSize: '30px',
            }}>관심사를 선택해주세요.</h3>
            <div className="select_body_box">
                <div className="category-buttons">
                    {categoryRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="category-row">
                            {row.map((category, index) => (
                                <button
                                    key={index}
                                    style={{
                                        backgroundColor: selectedCategories.includes(category) ? '#F7FFF9' : 'white',
                                        color: selectedCategories.includes(category) ? 'black' : '',
                                        fontWeight: selectedCategories.includes(category) ? 'bold' : '',
                                        border: '2px solid #A0EBB5',
                                        borderRadius: '15px',
                                        padding: '10px 20px',
                                        margin: '5px',
                                        maxWidth: '250px',
                                        mWidth: '200px',
                                        fontSize: '25px',
                                        cursor: selectedCategories.length < 3 || selectedCategories.includes(category) ? 'pointer' : 'not-allowed',
                                    }}
                                    onClick={() => handleCategoryClick(category)}
                                    disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="recipe_title_group"
                 style={{marginBottom: '300px', fontWeight: 'normal', cursor: 'pointer', height: '150px'}}>
                <div className="body_left_top_button" style={{fontWeight: 'normal'}}
                     onClick={handleSubmit}>
                    Submit Selected Categories
                </div>
            </div>
        </div>
    );
};

export default SelectCategory;
