import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { NoSSR } from 'render'

import ThumbnailItem from './ThumbnailItem'
import ThumbnailArrow from './ThumbnailArrow'
import Slider from '../../../Slider'

import { HORIZONTAL, VERTICAL } from '../constants/orientation'

const MAX_VISIBLE_ITEMS = 4

/**
 * Thumbnail component.
 * Display a slider with a list of thumbnail images.
 */
class ThumbnailSlider extends Component {
  /**
   * Function that configure slider settings according to the component props
   */
  get sliderSettings() {
    const { maxVisibleItems, orientation } = this.props
    const sliderVertical = orientation === VERTICAL

    const numOfVisibleItems = Math.min(maxVisibleItems, MAX_VISIBLE_ITEMS)

    return {
      speed: 500,
      infinite: false,
      dots: false,
      arrows: true,
      prevArrow: <ThumbnailArrow vertical={sliderVertical} />,
      nextArrow: <ThumbnailArrow inverted vertical={sliderVertical} />,
      slideWidth: 82,
      slidesToShow: numOfVisibleItems,
      vertical: sliderVertical,
      verticalSwiping: sliderVertical,
      /** Responsive slider behavior is defined here */
      responsive: [
        /** Should be rendered for all screens with width less than 600px */
        {
          breakpoint: 600,
          settings: {
            dots: true,
            arrows: false,
            slidesToShow: 1,
            vertical: false,
            verticalSwiping: false,
          },
        },
      ],
    }
  }

  createThumbnailItem = (image, key) => {
    const { onThumbnailClick } = this.props
    return <ThumbnailItem key={key} image={image} onClick={onThumbnailClick} />
  }

  getClassByItemsPerPage(itemsPerPage) {
    switch (itemsPerPage) {
      case 5:
        return 'w-20'
      case 4:
        return 'w-25'
      case 3:
        return 'w-third'
    }
  }

  ssrFallback() {
    const { maxVisibleItems, images } = this.props

    const numOfVisibleItems = Math.min(maxVisibleItems, MAX_VISIBLE_ITEMS)

    const className = this.getClassByItemsPerPage(numOfVisibleItems)

    return (
      <div className="flex justify-center">
        {images.slice(0, numOfVisibleItems).map(image => {
          return (
            <div
              key={image.imageUrl}
              className={`${className} flex justify-center`}
            >
              {this.createThumbnailItem(image)}
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    const { images, orientation } = this.props

    const sliderVertical = orientation === VERTICAL

    const className = classNames('vtex-product-image__thumbnail-slider', {
      'vtex-product-image__thumbnail-slider--vertical pa3': sliderVertical,
      'vtex-product-image__thumbnail-slider--horizontal pa3': !sliderVertical,
    })

    return (
      <div className={className}>
        <NoSSR onSSR={this.ssrFallback()}>
          <Slider sliderSettings={this.sliderSettings}>
            {images.map(image => this.createThumbnailItem(image))}
          </Slider>
        </NoSSR>
      </div>
    )
  }
}

ThumbnailSlider.propTypes = {
  /** Array of images to be passed for the Thumbnail Slider component as a props */
  images: PropTypes.arrayOf(
    PropTypes.shape({
      /** URL of the image */
      imageUrl: PropTypes.string.isRequired,
      /** Text that describes the image */
      imageText: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Function that is called when a thumbnail is clicked */
  onThumbnailClick: PropTypes.func.isRequired,
  /** Slider orientation that could be vertical or horizontal */
  orientation: PropTypes.oneOf([VERTICAL, HORIZONTAL]),
  /** Maximum number of items that could be displayed by the slider at the same time */
  maxVisibleItems: PropTypes.number,
}

ThumbnailSlider.defaultProps = {
  orientation: VERTICAL,
  maxVisibleItems: MAX_VISIBLE_ITEMS,
}

export default ThumbnailSlider
