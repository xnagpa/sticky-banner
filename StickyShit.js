'use strict';


/**
 * Значения по умолчанию для модуля
 * @type {{marginTopBanner: number, marginBottomBanner: number, timeoutForPositions: number, timeoutForAdvMutation: number, timeForCheckChangingBanners: number}}
 */
const defaults = {
  topColumn: '.js-top-column',


  topColumnContainer: '.js-top-column-container',


  lowerColumn: '.js-lower-column',

  contentBlock: '.content-block',


  lowerColumnContainer: '.js-lower-column-container'
};


/**
 * Фиксирование 2-ого баннера 240x400 нв странице
 */
 class StickyShit {
  constructor() {
    this.settings = defaults;
    this.topColumn = document.querySelector(this.settings.topColumn);
    this.topColumn.style.position = 'relative';

    this.topColumnContainer = document.querySelector(this.settings.topColumnContainer);

    this.lowerColumn = document.querySelector(this.settings.lowerColumn);
    this.lowerColumn.style.position = 'relative';
    this.lowerColumnContainer = document.querySelector(this.settings.lowerColumnContainer);


    if (this.topColumn) {
      this.topColumn.sticky = true;
    }

    if (this.lowerColumn) {
      this.lowerColumn.sticky = true;
    }

    this.contentBlock = document.querySelector(this.settings.contentBlock);
    this.addHandlers = this.addHandlers.bind(this);
    this.fixedBanner = this.fixedBanner.bind(this);
    this.getChoord = this.getChoord.bind(this);

    this.addHandlers();
  }

  addHandlers() {
    setInterval(() => {
       this.fixedBanner(this.topColumn, this.topColumnContainer, 'topColumn');
       this.fixedBanner(this.lowerColumn, this.lowerColumnContainer, 'lowerColumn');
    }, 100);

    setTimeout(() => {
      console.log('ABSOLUTE');
      this.makeElementAbsoluteRelativeToParent(this.topColumn, this.topColumnContainer);
      this.topColumn.sticky = false;
    }, 4000);

    setTimeout(() => {
      console.log('ENLARGE UR PINUS');
      this.lowerColumn.style.height = '200px';
    }, 8000);
    // window.addEventListener('scroll', topColumnScrollHandler);
    // window.addEventListener('scroll', lowerColumnScrollHandler);
  }

  fixedBanner(element, parent, banner) {
    const stopScrolling = this.getChoord(element).top + element.offsetHeight > this.contentBlock.offsetHeight + this.getChoord(this.contentBlock).top;

    if (this.elementShouldBeGluedToTheBottom(element)) {
      console.log('elementShouldBeGluedToTheBottom');
      console.log(element);
      this.toTheBottom(element, parent);
    }

    if(stopScrolling) {
      console.log('stopScrolling');
      this.toTheBottom(element, parent);
    }

    if(this.isElementInViewport(element) && (element.sticky && this.elementShouldBecomeSticky(element))) {
      console.log('elementShouldBecomeSticky');
      this.makeElementFixed(element);
    }

    if (this.areWeHeadingBack(element)) {
      console.log('areWeHeadingBack');
      console.log(this.areWeHeadingBack(element));
      this.makeElementFixed(element);
    }

    if (this.didWeReachStartingPosition(element, parent)) {
      console.log('didWeReachStartingPosition');
      this.makeElementRelative(element);
    }


    if (this.areWeHeadingBack(element)) {
      console.log('going home!');
    }

    // console.log(`in view: ${this.isElementInViewport(element)}`);
    // console.log(`should be sticky: ${this.elementShouldBecomeSticky(element)}`);
    // console.log(`heading back: ${this.areWeHeadingBack(element)}`);

    // console.log('------------');
  }

  getChoord(elem) {
    const box = elem.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
  }

  makeElementFixed(element) {
    element.style.width = '300px';
    element.style.position = 'fixed';
    element.style.top = '0px';
  }

  makeElementAbsoluteRelativeToParent(element, parent) {
    parent.style.position = 'relative';
    element.style.position = 'absolute';
    const newTop = window.pageYOffset - this.getChoord(parent).top;
    element.style.top = `${newTop}px`;
  }

  toTheBottom(element, parent) {
    let delta = 0
    if (element.classList.contains('js-top-column')) {
      delta = this.contentBlock.offsetHeight - element.offsetHeight
    } else {
      let parentBannerTop =  0 ;
      if (this.topColumn && this.topColumn.style.position == 'absolute') {
        parentBannerTop = parseInt(this.topColumn.style.top, 10);
      } else if (this.topColumn && this.topColumn.style.position == 'relative') {
        parentBannerTop = 32;
      }
      delta = this.contentBlock.offsetHeight - this.topColumn.offsetHeight - parentBannerTop - this.lowerColumn.offsetHeight;
    }
    parent.style.position = 'relative';
    element.style.position = 'absolute';
    element.style.top = `${delta}px`;
    console.log(element);
    console.log(element.style.position);
    console.log(delta);
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;


    const isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  }

  elementShouldBecomeSticky(element) {
    const elementWithinViewport = window.pageYOffset > this.getChoord(element).top && window.pageYOffset < this.getChoord(element).top + element.offsetHeight;
    const elementRelative = element.style.position === 'relative';
    return elementWithinViewport && elementRelative;
  }

  elementShouldBeGluedToTheBottom(element) {
    // if (bannerNo === 'topColumn' && !this.topColumnNeedsToBeSticky) return false;
     return window.pageYOffset > this.getChoord(element).top + element.offsetHeight && element.style.position == 'relative' && element.sticky;
  }

  didWeReachStartingPosition(element, parent) {
    // console.log(this.getChoord(parent).top);
    // console.log(parent.offsetHeight)
    // console.log(this.getChoord(element).top)
    return this.getChoord(element).top <  this.getChoord(parent).top;
  }


  areWeHeadingBack(element) {
    console.log(`areWeHeadingBack: ${window.pageYOffset < this.getChoord(element).top && element.style.position === 'absolute'}`);
    return window.pageYOffset < this.getChoord(element).top && element.style.position === 'absolute';
  }


  // makeElementFixed(element) {
  //   element.style.width = '300px';
  //   element.style.position = 'fixed';
  //   element.style.top = '0px';
  // }


  makeElementRelative(element) {
    element.style.position = 'relative';
    element.style.top = '0px';
  }


  // makeElementAbsolute(element, parent, defaultTop = null) {
  //   if (!element) return;
  //   parent.style.position = 'relative';
  //   element.style.position = 'absolute';


  //   if (!this.shouldScrollStop()) {
  //     let newTop = this.topRelativeTo(parent, element);
  //     if (Number.isInteger(defaultTop)) {
  //       newTop = defaultTop;
  //     }


  //     if (newTop >= 0) {
  //       element.style.top = `${newTop}px`;
  //     }
  //   }
  // }





  // isThereEnoughSpaceForStickyBanner(element) {
  //   return this.contentBlock.offsetHeight > this.sidebarTop.offsetHeight && this.isElementInViewport(element);
  // }


  // topRelativeTo(parent, element) {
  //   let delta = 0;
  //   if (element === this.topColumn) {
  //     if (this.lowerColumn && this.secondBanner.offsetHeight === 0) {
  //       delta = 600;
  //     }
  //   }


  //   const newTop = window.pageYOffset - this.getChoord(parent).top;
  //   const newBannerHeight = this.getChoord(parent).top + newTop + element.offsetHeight;
  //   const contentHeight = this.getChoord(this.contentBlock).top + this.contentBlock.offsetHeight;


  //   if (newBannerHeight - contentHeight > 0) {
  //     return window.pageYOffset - this.getChoord(parent).top - (newBannerHeight - contentHeight) - delta;
  //   }
  //   return window.pageYOffset - this.getChoord(parent).top - delta;
  // }
};

export default StickyShit;