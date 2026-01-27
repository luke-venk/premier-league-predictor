import InfoCard from "../components/InfoCard";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1>About the Project</h1>
      <InfoCard>
        For our final project for Dr. Bui's machine learning class in the Fall
        of 2025, two colleagues and I decided to create and compare various
        machine learning models to determine which would be the best at
        predicting Premier League match outcomes. It is important to keep in
        mind that this is a classification problem with{" "}
        <strong>three possible outcomes</strong>: a home win, an away win, or a
        draw.
      </InfoCard>
      <InfoCard title="Datasets and Feature Engineering">
        Any good machine learning engineer will tell you that a model can only
        be as good as its dataset. In other words, "garbage in, garbage out". To
        ensure our model had ample information to learn the phenomena of
        matches, we used three datasets:
        <ul className="about-list data">
          <li>
            <a href="https://football-data.co.uk/englandm.php">
              Football-Data.co.uk
            </a>
            : Match statistics (goals, shots, fouls)
          </li>
          <li>
            <a href="https://www.transfermarkt.co.uk/premier-league/startseite/wettbewerb/GB1">
              TransferMarkt
            </a>
            : Estimated market valuation of squads
          </li>
          <li>
            <a href="https://www.footballcritic.com/premier-league/season-2025-2026/2/76035">
              FootballCritic
            </a>
            : Possession
          </li>
        </ul>
        We wanted our model to emphasize the importance of a team's recent
        performance, otherwise known as <strong>"form"</strong>, so we dedicated
        considerable efforts to quantifying form by aggregating a team's
        statistics over a fixed window of previous games. We also engineered Elo
        and head-to-head features.
      </InfoCard>
      <InfoCard title="Methodology">
        After cleaning our data and engineering our feature matrices, we created
        a 70-30 train-test split while preserving the temporal nature of sports
        seasons by reserving the first 7 of the previous 10 seasons for
        training, and using the remaining 3 seasons for evaluting our models'
        performance. We compared the performance of the following models:
        <ul className="about-list models">
          <li>Logistic Regression</li>
          <li>Random Forest</li>
          <li>Support Vector Machine</li>
          <li>XGBoost</li>
          <li>MLPFFNN</li>
          <li>Naive Bayes</li>
          <li>Voting Ensemble</li>
        </ul>
      </InfoCard>
      <InfoCard title="Final Model">
        After extensive analysis, the highest performing model was a{" "}
        <strong>Voting Ensemble</strong> method combining Logistic Regression,
        XGBoost, and Random Forest. This model achieved a peak testing accuracy
        of <strong>0.5925</strong>, which is up to par with state-of-the-art
        models on this topic.
      </InfoCard>
      <InfoCard title="Resources">
        Please refer to the following resources for a more in-depth discussion
        regarding how we approached exploratory data analysis, principal component analysis,
        and model analysis.
        <ul className="about-list resources">
          <li>
            <a
              href="/docs/project_report.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report (PDF)
            </a>
          </li>
          <li>
            <a
              href="/docs/presentation_slides.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slides (PDF)
            </a>
          </li>
        </ul>
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
      </InfoCard>
    </div>
  );
};

export default AboutPage;
