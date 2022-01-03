import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsData: [],
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quality: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const productDetailsApiUrl = `https://apis.ccbp.in/products/${id}`
    console.log(productDetailsApiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(productDetailsApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        id: data.id,
        brand: data.brand,
        description: data.description,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products,
        availability: data.availability,
      }
      console.log(updatedData)

      const updatedSimilarProductsData = updatedData.similarProducts.map(
        eachObject => ({
          id: eachObject.id,
          availability: eachObject.availability,
          brand: eachObject.brand,
          description: eachObject.description,
          imageUrl: eachObject.image_url,
          price: eachObject.price,
          rating: eachObject.rating,
          title: eachObject.title,
          totalReviews: eachObject.total_reviews,
          style: eachObject.style,
        }),
      )
      console.log(updatedSimilarProductsData)
      this.setState({
        productsData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      console.log(response)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickMinusButton = () => {
    const {quality} = this.state
    if (quality > 1) {
      this.setState(prevState => ({quality: prevState.quality - 1}))
    }
  }

  onClickPlusButton = () => {
    this.setState(prevState => ({quality: prevState.quality + 1}))
  }

  renderInProgressView = () => (
    <div testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickContinueShopping = () => {
    console.log(this.props)
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view"
      />
      <h1 className="product-not-found">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderAllProducts = () => {
    const {productsData, similarProductsData, quality} = this.state
    const {
      imageUrl,
      price,
      title,
      description,
      totalReviews,
      rating,
      brand,
      availability,
    } = productsData

    return (
      <div className="app-container">
        <div className="products-container">
          <img src={imageUrl} alt="products" className="product-image" />
          <div className="product-details">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price} /-</p>
            <div className="rating-reviews-section">
              <div className="rating-section">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="availability-container">
              <p className="availability">Available:&nbsp;</p>
              <p className="availability-text">{availability}</p>
            </div>
            <div className="brand-container">
              <p className="brand">Brand:&nbsp;</p>
              <p className="brand-text"> {brand}</p>
            </div>
            <hr className="line" />
            <div className="buttons-container">
              <button
                type="button"
                testid="minus"
                className="minus-button"
                onClick={this.onClickMinusButton}
              >
                <BsDashSquare />
              </button>
              <p className="number-text">{quality}</p>
              <button
                type="button"
                testid="plus"
                className="plus-button"
                onClick={this.onClickPlusButton}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProductsData.map(eachProduct => (
              <SimilarProductItem
                productDetails={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAllProducts()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="products-item-container">{this.renderView()}</div>
      </>
    )
  }
}

export default ProductItemDetails
