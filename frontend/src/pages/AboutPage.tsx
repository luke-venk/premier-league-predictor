import "./AboutPage.css";

const AboutPage = () => {
  return (
    <>
      <h1>About This Project</h1>
      <h2>Introduction</h2>
      <p>
        Soccer is the world's most popular sport, and the English Premier League
        is its most-watched league, drawing billions of viewers each year. This
        project builds on prior work in which my colleagues and I developed a
        machine learning model to predict the outcomes of Premier League
        matches. After extensive research and model development, I built a
        full-stack frontend application that allows users to interact with the
        model and generate predictions for the 2025-2026 Premier League season.
      </p>
      <h2>About the Model</h2>
      <p>
        After extensive analysis, the highest performing model was a Voting
        Ensemble method of Logistic Regression, XGBoost, and Random Forest. This
        model achieved a peak testing accuracy of <strong>0.5925</strong>, which
        is up to par with state-of-the-art models on this topic. Please refer to
        the following resources for a more in-depth discussion regarding how we
        engineered our model.
      </p>
      <h2>Resources</h2>
      <ul className="resource-list">
        <li>
          <a href="https://github.com/luke-venk/premier-league-match-predictions/blob/main/reports/project_report.pdf" target="_blank" rel="noopener noreferrer">Report (open in GitHub)</a>
        </li>
        <li>
          <a href="https://raw.githubusercontent.com/luke-venk/premier-league-match-predictions/main/reports/project_report.pdf" target="_blank" rel="noopener noreferrer">Report (download PDF)</a>
        </li>
        <li>
          <a href="https://github.com/luke-venk/premier-league-match-predictions/blob/main/reports/presentation_slides.pdf" target="_blank" rel="noopener noreferrer">Slides (open in GitHub)</a>
        </li>
        <li>
          <a href="https://raw.githubusercontent.com/luke-venk/premier-league-match-predictions/main/reports/presentation_slides.pdf" target="_blank" rel="noopener noreferrer">Slides (download PDF)</a>
        </li>
      </ul>
      <h2>Video Demonstration</h2>
      <div className="video-container">
        <iframe 
          width="560"
          height="315"
          src="https://www.youtube.com/embed/VFaKTJ81YvU"
          title="Premier League Predictor Demonstration"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </>
  );
};

export default AboutPage;
