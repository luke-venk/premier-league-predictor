import "./InfoCard.css";

interface Props {
  title?: string;
  children: React.ReactNode;
}

const InfoCard = ({ title, children }: Props) => {
  return (
    <div className="info-card">
      {title && <h2 className="info-title">{title}</h2>}
      <div className="info-content">{children}</div>
    </div>
  );
};

export default InfoCard;
