import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, rating, brand, title, price} = productDetails
  console.log(rating, brand, title)

  return (
    <li className="product-list-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="product-item-image"
      />
      <h1 className="title-heading">{title}</h1>
      <p className="brand-text">by {brand}</p>
      <div className="price-rating-section">
        <p className="price-text">Rs {price}/-</p>
        <div className="rating-section1">
          <p className="rating-text">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-url"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
