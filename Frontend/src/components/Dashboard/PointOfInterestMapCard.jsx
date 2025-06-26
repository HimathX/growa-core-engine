const PointOfInterestMapCard = ({ onClick, imageUrl }) => {
    return (
        <div
            className="card point-of-interest-map-card"
            onClick={onClick}
            style={{
                backgroundImage: `url(${imageUrl})`,
            }}
        />
    );
};

export default PointOfInterestMapCard;