import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, maxRating = 5 }) => {
  return (
    <div className="d-flex align-items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => (
        index < rating ? (
          <FaStar key={index} color="#ffc107" />
        ) : (
          <FaRegStar key={index} color="#ffc107" />
        )
      ))}
    </div>
  );
};

export default StarRating;
