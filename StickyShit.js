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
    console.log('INITIALIZED!!!!');
    this.settings = defaults;
    this.topColumn = document.querySelector(this.settings.topColumn);

    this.topColumnContainer = document.querySelector(this.settings.topColumnContainer);

    this.lowerColumn = document.querySelector(this.settings.lowerColumn);
    this.lowerColumnContainer = document.querySelector(this.settings.lowerColumnContainer);


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
    }, 4000);
  
    setTimeout(() => {
      console.log('ENLARGE UR PINUS');
      this.lowerColumn.style.height = '700px';
    }, 8000);
    // window.addEventListener('scroll', topColumnScrollHandler);
    // window.addEventListener('scroll', lowerColumnScrollHandler);
  }

  fixedBanner(element, parent, banner) {
    //console.log(this.getChoord(element).top);
    const stopScrolling = this.getChoord(element).top + element.offsetHeight > this.contentBlock.offsetHeight + this.getChoord(this.contentBlock).top;

    if (this.elementShouldBeGluedToTheBottom(element)) {
      console.log('elementShouldBeGluedToTheBottom');
      this.toTheBottom(element, parent);
    }

    if(stopScrolling) {
      console.log('stopScrolling');
      this.toTheBottom(element, parent);
    }

    if (this.didWeReachStartingPosition(element, parent)) {
      console.log('didWeReachStartingPosition');
      this.makeElementRelative(element);
    }


    if (this.areWeHeadingBack(element)) {
      console.log('going home!');
    }

    if((this.isElementInViewport(element) && this.elementShouldBecomeSticky(element)) || this.areWeHeadingBack(element)) {
      console.log('elementShouldBecomeSticky');
      this.makeElementFixed(element);
    }
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
    parent.style.position = 'relative';
    element.style.position = 'absolute';
    let delta = 0
    if (element.classList.contains('js-top-column')) {
      delta = this.contentBlock.offsetHeight - element.offsetHeight
    } else {
      delta = this.contentBlock.offsetHeight - this.topColumn.offsetHeight - parseInt(this.topColumn.style.top, 10) - this.lowerColumn.offsetHeight;
    }

    console.log(delta);
    element.style.top = `${delta}px`;
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
     return window.pageYOffset > this.getChoord(element).top + element.offsetHeight && element.style.position == 'relative';
  }


  // addHandlers() {
  //   const infographicPic = this.contentBlock.querySelector('.b-topic_pic_780') || this.contentBlock.querySelector('.b-topic_pic_940');
  //   if (this.contentBlock && !infographicPic) {
  //     this.sidebarTop = document.querySelector(this.settings.sidebarTop);


  //     this.calculateMarginTop = this.calculateMarginTop.bind(this);
  //     this.calculateMarginTop();


  //     let topColumnScrollHandler = null;
  //     if (this.firstBanner && this.topColumn && this.topColumnContainer) {
  //       topColumnScrollHandler = () => this.fixedBanner(this.topColumn, this.topColumnContainer, 'topColumn');
  //     }
  //     let lowerColumnScrollHandler = null;
  //     if (this.secondBanner && this.lowerColumn && this.lowerColumnContainer) {
  //       lowerColumnScrollHandler = () => this.fixedBanner(this.lowerColumn, this.lowerColumnContainer, 'lowerColumn');
  //     }


  //     setTimeout(() => {
  //       topColumnScrollHandler && topColumnScrollHandler();
  //       window.addEventListener('scroll', topColumnScrollHandler);


  //       lowerColumnScrollHandler && lowerColumnScrollHandler();
  //       window.addEventListener('scroll', lowerColumnScrollHandler);


  //       setInterval(() => {
  //         if (this.shouldGlueToBottom()) {
  //           console.log('GLUE!!!');
  //           console.log(`contentBlock ${this.contentBlock.offsetHeight}`);
  //           console.log(`sidebarTop ${this.sidebarTop.offsetHeight}`);
  //           console.log(`topColumn ${this.topColumn.offsetHeight}`);
  //           console.log(`lowerColumn ${this.lowerColumn.offsetHeight}`);


  //           let top = this.contentBlock.offsetHeight - this.sidebarTop.offsetHeight - 220; // - this.sidebarTop.offsetHeight - this.topColumn.offsetHeight - 200;
  //           if (this.topColumn && this.lowerColumn) {
  //             this.makeElementAbsolute(this.topColumn, this.topColumnContainer);
  //             this.makeElementAbsolute(this.lowerColumn, this.lowerColumnContainer, 0);
  //           } else {
  //             this.makeElementAbsolute(this.topColumn, this.topColumnContainer);
  //           }
  //         }
  //       }, 200);


  //       this.addBegunToFirstBanner();
  //     }, this.settings.timeoutForPositions);
  //   }
  // }


  // addBegunToFirstBanner() {
  //   if (this.firstBanner && this.topColumn && this.topColumnContainer) {
  //     window.Begun && window.Begun.Autocontext.Callbacks.register({
  //       'inView': {
  //         'ban_240x400': ({ sessionInViewTime }) => {
  //           if (sessionInViewTime > this.settings.desiredBannerShowTimeInSeconds) {
  //             this.topColumnNeedsToBeSticky = false;
  //             this.makeElementAbsolute(this.topColumn, this.topColumnContainer);
  //             window.Begun.Autocontext.Callbacks.unregister('inView', 'ban_240x400');
  //           }
  //         }
  //       }
  //     });
  //   }
  // }


  // calculateMarginTop() {
  //   // В случае если у верхнего блока есть margin-bottom - применяем его значение к переданному параметру marginTopBanner
  //   const sidebarTopStyles = window.getComputedStyle(this.sidebarTop);
  //   this.diffMarginTop = this.settings.marginTopBanner - parseInt(sidebarTopStyles.marginBottom, 10);
  // }


  //  /**
  //  * Метод отвечающий за фиксирование баннера
  //  */
  // fixedBanner(element, container, bannerNo) {
  //   if (this.isThereEnoughSpaceForStickyBanner(element)) {
  //     if (this.elementShouldBecomeSticky(element, bannerNo) || this.areWeHeadingBack(element)) {
  //       this.makeElementFixed(element);
  //     } else if (this.didWeReachStartingPosition(element, container)) {
  //       this.makeElementRelative(element);
  //     } else if (this.shouldScrollStop()) {
  //       this.makeElementAbsolute(element, container);
  //     }
  //   }
  //   // } else if (this.shouldGlueToBottom() && bannerNo === 'lowerColumn') {
  //   //   this.makeElementAbsolute(this.lowerColumn, this.lowerColumnContainer);
  //   // }
  // }





  // shouldScrollStop() {
  //   return this.topColumn && this.shouldStop(this.topColumn) || this.lowerColumn && this.shouldStop(this.lowerColumn);
  // }


  // shouldStop(element) {
  //   if (this.settings.brief && element === this.topColumn) {
  //     return true;
  //   }
  //   return this.getChoord(this.contentBlock).top + this.contentBlock.offsetHeight < this.getChoord(element).top + element.offsetHeight;
  // }


  // shouldGlueToBottom() {
  //   //debugger;
  //   if (this.lowerColumn) {
  //     console.log("LOWER");
  //     return window.pageYOffset > this.getChoord(this.lowerColumn).top + this.lowerColumn.offsetHeight;
  //   }
  //   return window.pageYOffset > this.getChoord(this.topColumn).top + this.topColumn.offsetHeight;
  // }


  didWeReachStartingPosition(element, parent) {
    return this.getChoord(element).top <  this.getChoord(parent).top + parent.offsetHeight;
  }


  areWeHeadingBack(element) {
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