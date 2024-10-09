import React, { useState, useEffect } from "react";
import Header from "./Header";
import { searchIngredients } from "./apis/Recipe_api";
// 외부 CSS 파일 불러오기

const Test = () => {
    return (
        <div className="document">
            <Header />
            <Body />
        </div>
    );
};

function Body() {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (keyword.trim().length > 1) {
                try {
                    const data = await searchIngredients(keyword);
                    setResults(data);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            } else {
                setResults([]);
            }
        };

        fetchResults();
    }, [keyword]);

    return (
        <div className="search-container">
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search for ingredients..."
                className="search-input"
            />
            {isFocused && (keyword.length > 0 || results.length > 0) && (
                <div className="results-box">
                    {results.length > 0 ? (
                        <ul className="results-list">
                            {results.slice(0, 5).map((ingredient) => (
                                <li key={ingredient.id} className="results-item">
                                    {ingredient.id} ({ingredient.foodName})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-results">No results found</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Test;
