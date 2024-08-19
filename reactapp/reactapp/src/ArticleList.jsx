import React, { useEffect, useState } from "react";
import "./card.css";
import { useContext } from "react";
import ThemeContext from "./ThemeContext";

function convertTime(publishedTime) {
  let localDate = new Date(publishedTime).toLocaleDateString();
  let localTime = new Date(publishedTime).toLocaleTimeString();

  let localDateTime = localDate + " " + localTime;
  return localDateTime;
}

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  const [loading, setLoading] = useState(false);

  const fetchArticles = (sortOption) => {
    setLoading(true);
    fetch(`http://localhost:3000/api/articles?sortBy=${sortOption}`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles(sortBy);
  }, [sortBy]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const { theme } = useContext(ThemeContext);

  const cardColorModes = {

    cardBorderDarkColorMode: window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--light-gray"),
    cardBorderLightColorMode: window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--dark-gray"),

    cardBoxShadowDarkColorMode: window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--box-shadow"),

    cardBoxShadowLightColorMode: window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--dark-gray"),
  };

  return (
    <div>
      <div>
        <label htmlFor="sortBy">Sortera efter:</label>
        <select
          id="sortBy"
          name="sortBy"
          className="form-select"
          value={sortBy}
          onChange={handleSortChange}>
          <option value="">Inget specifik</option>
          <option value="newest">Nyast</option>
          <option value="oldest">Äldst</option>
        </select>
      </div>
      {loading ? (
        <div className="loading-animation"></div>
      ) : (
        <div>
          <div id="card-collection">
            {articles.map((article) => (
              <div
                key={article.id || article.title}
                className={`card ${theme === "dark" ? "dark-theme-card" : "light-theme-card"}`}>
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{article.summary}</p>
                  <a
                    href={article.link}
                    className="card-link"
                    target="_blank">
                    Läs mer
                  </a>
                  <p className="card-publish-text">
                    {convertTime(article.published)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
